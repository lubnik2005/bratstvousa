<?php

namespace Bratstvo\CampCheckIn\Http\Controllers;

use App\Models\CampCheckInRecord;
use App\Models\CampRegistration;
use App\Models\ZeffyPayment;
use App\Services\CampCheckInService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckInController
{
    public function lookup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'value' => ['required', 'string', 'max:2048'],
            'refresh_zeffy' => ['nullable', 'boolean'],
        ]);
        $input = trim((string) $validated['value']);
        $values = $this->lookupValues($input);
        $registration = $this->findRegistration($input);

        if ($registration) {
            Gate::authorize('view', $registration);
        }

        return response()->json([
            'rawValue' => $input,
            'extractedValues' => $values,
            'registration' => $registration ? $this->payload($registration, false) : null,
            'zeffy' => $this->zeffyPayload($registration, $values, $validated['refresh_zeffy'] ?? true),
            'message' => $registration ? null : 'No camp registration matches this ticket. Zeffy details are shown when available.',
        ]);
    }

    public function perform(Request $request, CampRegistration $registration, CampCheckInService $service): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'in:check_in,collect_cash,repeat_check_in'],
            'note' => ['nullable', 'string', 'max:500'],
            'request_id' => ['nullable', 'uuid'],
        ]);
        $action = $validated['action'];
        Gate::authorize('update', $registration);

        $result = match ($action) {
            'check_in' => $service->checkIn($registration, 'nova:scanner', $validated['request_id'] ?? null),
            'collect_cash' => $service->collectCashAndCheckIn($registration, 'nova:scanner', $validated['request_id'] ?? null),
            'repeat_check_in' => $service->repeatCheckIn($registration, 'nova:scanner', $validated['note'] ?? null, $validated['request_id'] ?? null),
        };

        $registration->refresh();

        return response()->json([
            'result' => $result,
            'registration' => $this->payload($registration),
        ], $result['ok'] ? 200 : 422);
    }

    private function findRegistration(string $input): ?CampRegistration
    {
        $values = $this->lookupValues($input);
        preg_match('/CAMP-[A-Z0-9]+/i', $input, $code);

        return CampRegistration::query()
            ->where(function ($query) use ($values, $code): void {
                $query->whereIn('zeffy_ticket_id', $values)
                    ->orWhereIn('zeffy_payment_id', $values);

                if (isset($code[0])) {
                    $query->orWhereRaw('upper(confirmation_code) = ?', [strtoupper($code[0])]);
                }
            })
            ->first();
    }

    /** @return array<int, string> */
    private function lookupValues(string $input): array
    {
        return collect([$input, rawurldecode($input)])
            ->merge($this->urlValues($input))
            ->filter(fn (mixed $value): bool => is_string($value) && $value !== '')
            ->map(fn (string $value): string => trim($value))
            ->filter(fn (string $value): bool => mb_strlen($value) <= 255)
            ->unique()
            ->values()
            ->all();
    }

    /** @return array<int, string> */
    private function urlValues(string $input): array
    {
        $parts = parse_url($input);
        if (! is_array($parts)) {
            return [];
        }

        parse_str($parts['query'] ?? '', $query);
        $values = array_filter($query, 'is_string');
        if (isset($parts['path'])) {
            $values[] = basename($parts['path']);
        }

        return $values;
    }

    /** @return array<string, mixed> */
    private function payload(CampRegistration $registration, bool $refreshZeffy = false): array
    {
        $payment = $registration->payment_status;
        $checkedIn = $registration->checkin_status === 'CHECKED_IN';
        $decision = match (true) {
            $checkedIn => 'repeat_check_in',
            $payment === 'PAID' => 'check_in',
            $payment === 'DUE' => 'collect_cash',
            default => 'blocked',
        };
        $message = match ($decision) {
            'check_in' => $registration->church_balance_cents > 0
                ? 'Paid by attendee; church balance remains.'
                : 'Paid in full. Ready to check in.',
            'collect_cash' => 'Cash is due before check-in.',
            default => $checkedIn
                ? 'Already checked in. Confirm a repeat entry only if this attendee is returning.'
                : 'Check-in is blocked. An admin must resolve this payment state.',
        };

        return [
            'id' => $registration->id,
            'name' => trim($registration->first_name.' '.$registration->last_name),
            'confirmationCode' => $registration->confirmation_code,
            'church' => $registration->church,
            'paymentStatus' => $payment,
            'paymentMethod' => $registration->payment_method,
            'checkinStatus' => $registration->checkin_status,
            'amountPaidCents' => (int) $registration->amount_paid_cents,
            'amountDueCents' => (int) $registration->amount_due_cents,
            'churchBalanceCents' => (int) $registration->church_balance_cents,
            'checkIns' => CampCheckInRecord::query()
                ->where('registration_id', $registration->id)
                ->latest('checked_in_at')
                ->get()
                ->map(fn (CampCheckInRecord $checkIn): array => [
                    'id' => $checkIn->id,
                    'checkedInAt' => $checkIn->checked_in_at?->toIso8601String(),
                    'checkedInBy' => $checkIn->checked_in_by,
                    'isRepeat' => $checkIn->is_repeat,
                    'note' => $checkIn->note,
                ])
                ->all(),
            'zeffy' => $this->zeffyPayload($registration, [], $refreshZeffy),
            'decision' => $decision,
            'message' => $message,
        ];
    }

    /** @return array<string, mixed> */
    private function zeffyPayload(?CampRegistration $registration, array $candidates, bool $refresh): array
    {
        $ticketId = collect($candidates)
            ->first(fn (mixed $value): bool => is_string($value) && preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $value) === 1);
        $stored = $registration
            ? ZeffyPayment::query()
                ->where('zeffy_payment_id', $registration->zeffy_payment_id)
                ->orWhere('matched_registration_id', $registration->id)
                ->latest('created_at')
                ->first()
            : ($ticketId
                ? ZeffyPayment::query()
                    ->where('raw_json', 'like', '%'.$ticketId.'%')
                    ->latest('created_at')
                    ->first()
                : null);
        $paymentId = $registration?->zeffy_payment_id ?: $stored?->zeffy_payment_id;
        $payload = [
            'paymentId' => $paymentId,
            'ticketId' => $registration?->zeffy_ticket_id ?: $ticketId,
            'status' => $stored?->status,
            'amountCents' => $stored?->amount,
            'currency' => $stored?->currency,
            'buyerName' => trim(($stored?->buyer_first_name ?? '').' '.($stored?->buyer_last_name ?? '')) ?: null,
            'buyerEmail' => $stored?->buyer_email,
            'matchStatus' => $stored?->match_status,
            'live' => null,
            'liveError' => null,
        ];

        $identifiers = collect([$paymentId])
            ->merge($candidates)
            ->filter(fn (mixed $value): bool => is_string($value) && preg_match('/^[A-Za-z0-9_-]{3,255}$/', $value) === 1)
            ->unique()
            ->take(5);

        if (! $refresh || $identifiers->isEmpty()) {
            if ($refresh && $identifiers->isEmpty()) {
                $payload['liveError'] = 'No Zeffy payment identifier was found in this QR code.';
            }

            return $payload;
        }

        $apiKey = config('services.zeffy.api_key') ?: env('ZEFFY_API_KEY');
        if (! $apiKey) {
            $payload['liveError'] = 'Live Zeffy refresh is not configured.';

            return $payload;
        }

        try {
            foreach ($identifiers as $identifier) {
                $response = Http::withToken($apiKey)
                    ->acceptJson()
                    ->timeout(8)
                    ->get('https://api.zeffy.com/api/v1/payments/'.$identifier);

                if ($response->successful()) {
                    $paymentId = $identifier;

                    break;
                }
            }

            if (! isset($response) || ! $response->successful()) {
                $payload['liveError'] = 'Zeffy did not recognize the identifiers encoded in this QR code.';
                Log::warning('Camp check-in Zeffy refresh failed', ['identifier_count' => $identifiers->count(), 'status' => $response?->status()]);

                return $payload;
            }

            $payment = $response->json('data') ?? $response->json();
            $buyer = is_array($payment['buyer'] ?? null) ? $payment['buyer'] : [];
            $payload['live'] = [
                'paymentId' => $payment['id'] ?? $paymentId,
                'status' => $payment['status'] ?? null,
                'amountCents' => isset($payment['amount']) ? (int) $payment['amount'] : null,
                'currency' => $payment['currency'] ?? null,
                'buyerName' => trim(($buyer['first_name'] ?? '').' '.($buyer['last_name'] ?? '')) ?: null,
                'buyerEmail' => $buyer['email'] ?? null,
                'createdAt' => $payment['created'] ?? null,
                'refreshedAt' => now()->toIso8601String(),
            ];
        } catch (\Throwable $exception) {
            $payload['liveError'] = 'Zeffy could not refresh this payment right now.';
            Log::warning('Camp check-in Zeffy refresh failed', ['payment_id' => $paymentId, 'error' => $exception->getMessage()]);
        }

        return $payload;
    }
}
