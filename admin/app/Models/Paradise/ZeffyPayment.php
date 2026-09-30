<?php

namespace App\Models\Paradise;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ZeffyPayment extends Model
{
    protected $connection = 'd1_paradise';

    protected $table = 'paradise_zeffy_payments';

    protected $fillable = [
        'zeffy_payment_id',
        'status',
        'amount',
        'currency',
        'buyer_email',
        'buyer_first_name',
        'buyer_last_name',
        'campaign_id',
        'contact_id',
        'event_id',
        'match_status',
        'credited_cents',
        'raw_json',
    ];

    protected $casts = [
        'amount' => 'integer',
        'credited_cents' => 'integer',
        'event_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (ZeffyPayment $payment) {
            if ($payment->buyer_email) {
                $payment->buyer_email = strtolower(trim($payment->buyer_email));
            }
        });
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    /** Decoded raw Zeffy payload (array) or null. */
    public function payload(): ?array
    {
        if (! $this->raw_json) {
            return null;
        }
        $decoded = json_decode($this->raw_json, true);

        return is_array($decoded) ? $decoded : null;
    }

    /** Sum of ledger top-ups already credited for this payment. */
    public function creditedTopups(): int
    {
        return (int) LedgerEntry::query()
            ->where('zeffy_payment_id', $this->zeffy_payment_id)
            ->where('kind', 'topup')
            ->sum('amount_cents');
    }

    /**
     * Credit this payment to the buyer's wallet (idempotent via the
     * (zeffy_payment_id, kind) unique index). Returns cents credited now (0 if already applied).
     */
    public function applyToWallet(): int
    {
        $email = $this->buyer_email ? strtolower(trim($this->buyer_email)) : null;
        if (! $email || $this->status !== 'succeeded') {
            return 0;
        }

        $now = now()->utc()->format('Y-m-d H:i:s');
        $amount = max(0, (int) round($this->amount));
        $payload = $this->payload();

        $inserted = $this->getConnection()->table('paradise_ledger')->insertOrIgnore([
            'email' => $email,
            'attendee_id' => Attendee::query()->where('email', $email)->value('id'),
            'event_id' => $this->event_id,
            'kind' => 'topup',
            'amount_cents' => $amount,
            'zeffy_payment_id' => $this->zeffy_payment_id,
            'note' => $payload['description'] ?? 'Zeffy top-up',
            'created_at' => $now,
        ]);

        $this->forceFill([
            'match_status' => 'matched',
            'credited_cents' => $this->creditedTopups(),
        ])->save();

        return $inserted ? $amount : 0;
    }
}
