<?php

namespace App\Models\Paradise;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Attendee extends Model
{
    protected $connection = 'd1_paradise';

    protected $table = 'paradise_attendees';

    protected $fillable = [
        'email',
        'first_name',
        'last_name',
        'sex',
        'verified_at',
        'last_login_at',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'attendee_id');
    }

    public function ledgerEntries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class, 'attendee_id');
    }

    /**
     * Wallet balance in cents (sum of all ledger rows for this email).
     */
    public function balanceCents(): int
    {
        if (! $this->email) {
            return 0;
        }

        $sum = DB::connection('d1_paradise')
            ->table('paradise_ledger')
            ->where('email', strtolower(trim($this->email)))
            ->sum('amount_cents');

        return (int) $sum;
    }
}
