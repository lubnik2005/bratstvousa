<?php

namespace App\Services;

use App\Models\CampRegistration;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CampCheckInService
{
    /**
     * @return array{ok: bool, code: string, message: string}
     */
    public function checkIn(CampRegistration $registration, string $source): array
    {
        $registration->refresh();

        if ($registration->checkin_status === 'CHECKED_IN') {
            return $this->result(false, 'already_checked_in', 'This attendee has already checked in.');
        }

        if ($registration->payment_status !== 'PAID') {
            return $this->result(false, 'payment_not_paid', 'This attendee is not fully paid and cannot check in.');
        }

        $actor = $this->actorLabel();
        $now = now()->toIso8601String();

        try {
            $registration->checkin_status = 'CHECKED_IN';
            $registration->checked_in_at = $now;
            $registration->checked_in_by = $actor;
            $registration->save();

            $this->recordEvent($registration->id, 'checked_in', null, $actor, [
                'source' => $source,
                'payment_status' => $registration->payment_status,
                'payment_method' => $registration->payment_method,
            ]);
        } catch (\Throwable $e) {
            Log::error('Camp check-in failed', ['registration_id' => $registration->id, 'error' => $e->getMessage()]);

            return $this->result(false, 'failed', 'Unable to check in this attendee.');
        }

        return $this->result(true, 'checked_in', 'Attendee checked in.');
    }

    /**
     * @return array{ok: bool, code: string, message: string}
     */
    public function collectCashAndCheckIn(CampRegistration $registration, string $source): array
    {
        $registration->refresh();

        if ($registration->checkin_status === 'CHECKED_IN') {
            return $this->result(false, 'already_checked_in', 'This attendee has already checked in.');
        }

        if (! in_array($registration->payment_status, ['DUE', 'REVIEW_REQUIRED', 'PENDING'], true)) {
            return $this->result(false, 'cash_not_collectable', 'Cash cannot be collected for this payment state.');
        }

        $actor = $this->actorLabel();
        $now = now()->toIso8601String();
        $due = (int) ($registration->amount_due_cents ?? $registration->event_price_cents ?? 0);
        $previousStatus = $registration->payment_status;

        try {
            // D1 applies this one model save as a single atomic UPDATE.
            $registration->payment_method = 'CASH';
            $registration->payment_status = 'PAID';
            $registration->amount_paid_cents = $due;
            $registration->amount_due_cents = 0;
            $registration->paid_at = $now;
            $registration->paid_by = $actor;
            $registration->checkin_status = 'CHECKED_IN';
            $registration->checked_in_at = $now;
            $registration->checked_in_by = $actor;
            $registration->save();

            $this->recordEvent($registration->id, 'cash_payment_collected', $due, $actor, [
                'source' => $source,
                'previous_payment_status' => $previousStatus,
            ]);
        } catch (\Throwable $e) {
            Log::error('Camp cash collection failed', ['registration_id' => $registration->id, 'error' => $e->getMessage()]);

            return $this->result(false, 'failed', 'Unable to record cash for this attendee.');
        }

        return $this->result(true, 'cash_collected_and_checked_in', 'Cash recorded and attendee checked in.');
    }

    /**
     * @return array{ok: bool, code: string, message: string}
     */
    private function result(bool $ok, string $code, string $message): array
    {
        return compact('ok', 'code', 'message');
    }

    /** @param array<string, mixed> $payload */
    private function recordEvent(int $registrationId, string $event, ?int $amountCents, string $staffUser, array $payload): void
    {
        try {
            DB::connection('d1')->table('registration_events')->insert([
                'registration_id' => $registrationId,
                'event' => $event,
                'amount_cents' => $amountCents,
                'staff_user' => $staffUser,
                'payload' => json_encode($payload),
                'created_at' => now()->toIso8601String(),
            ]);
        } catch (\Throwable $e) {
            Log::error('registration_events insert failed', ['registration_id' => $registrationId, 'event' => $event, 'error' => $e->getMessage()]);
        }
    }

    private function actorLabel(): string
    {
        $actor = Auth::user();

        return $actor ? ($actor->name.' (#'.$actor->getKey().')') : 'unknown';
    }
}
