<?php

namespace Bratstvo\CampCheckIn\Http\Controllers;

use App\Models\CampRegistration;
use App\Services\CampCheckInService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CheckInController
{
    public function lookup(Request $request): JsonResponse
    {
        $input = trim((string) $request->validate(['value' => ['required', 'string', 'max:2048']])['value']);
        $registration = $this->findRegistration($input);

        if (! $registration) {
            return response()->json(['message' => 'No camp registration matches this ticket.', 'registration' => null], 404);
        }

        Gate::authorize('view', $registration);

        return response()->json(['registration' => $this->payload($registration)]);
    }

    public function perform(Request $request, CampRegistration $registration, CampCheckInService $service): JsonResponse
    {
        $action = $request->validate(['action' => ['required', 'in:check_in,collect_cash']])['action'];
        Gate::authorize('update', $registration);

        $result = $action === 'check_in'
            ? $service->checkIn($registration, 'nova:scanner')
            : $service->collectCashAndCheckIn($registration, 'nova:scanner');

        $registration->refresh();

        return response()->json([
            'result' => $result,
            'registration' => $this->payload($registration),
        ], $result['ok'] ? 200 : 422);
    }

    private function findRegistration(string $input): ?CampRegistration
    {
        $values = collect([$input, rawurldecode($input)])
            ->merge($this->urlValues($input))
            ->filter(fn (mixed $value): bool => is_string($value) && $value !== '')
            ->map(fn (string $value): string => trim($value))
            ->unique()
            ->values();
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
    private function payload(CampRegistration $registration): array
    {
        $payment = $registration->payment_status;
        $checkedIn = $registration->checkin_status === 'CHECKED_IN';
        $decision = match (true) {
            $checkedIn => 'blocked',
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
                ? 'Already checked in. Do not admit again.'
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
            'decision' => $decision,
            'message' => $message,
        ];
    }
}
