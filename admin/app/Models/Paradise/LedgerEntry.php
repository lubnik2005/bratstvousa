<?php

namespace App\Models\Paradise;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Wallet ledger row. Balance for a camper = SUM(amount_cents) per email.
 * Kinds: topup (+Zeffy payment), debit (-bed price), refund (+bed price on cancel),
 * reversal (-Zeffy refund/dispute), adjustment (manual).
 */
class LedgerEntry extends Model
{
    protected $connection = 'd1_paradise';

    protected $table = 'paradise_ledger';

    // Table only has created_at (no updated_at).
    public $timestamps = false;

    protected $fillable = [
        'email',
        'attendee_id',
        'event_id',
        'kind',
        'amount_cents',
        'zeffy_payment_id',
        'reservation_id',
        'note',
        'created_at',
    ];

    protected $casts = [
        'attendee_id' => 'integer',
        'event_id' => 'integer',
        'amount_cents' => 'integer',
        'reservation_id' => 'integer',
        'created_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        // Nova submits empty strings for blank nullable fields; store NULL instead.
        static::saving(function (LedgerEntry $entry) {
            foreach (['attendee_id', 'event_id', 'reservation_id', 'zeffy_payment_id', 'note'] as $col) {
                if ($entry->getAttribute($col) === '') {
                    $entry->setAttribute($col, null);
                }
            }
        });

        static::creating(function (LedgerEntry $entry) {
            if ($entry->email) {
                $entry->email = strtolower(trim($entry->email));
            }
            if (! $entry->created_at) {
                $entry->created_at = now()->utc()->format('Y-m-d H:i:s');
            }
            if ($entry->email && ! $entry->attendee_id) {
                $entry->attendee_id = Attendee::query()->where('email', $entry->email)->value('id');
            }
        });
    }

    public function attendee(): BelongsTo
    {
        return $this->belongsTo(Attendee::class, 'attendee_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class, 'reservation_id');
    }
}
