<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ZeffyPayment extends Model
{
    /**
     * The zeffy_payments table lives in the shared Cloudflare D1 database
     * (written by both the SvelteKit webhook and the Laravel zeffy:sync job),
     * so pin this model to the "d1" connection.
     */
    protected $connection = 'd1';

    protected $table = 'zeffy_payments';

    protected $fillable = [
        'zeffy_payment_id',
        'status',
        'amount',
        'currency',
        'buyer_email',
        'buyer_first_name',
        'buyer_last_name',
        'confirmation_code',
        'matched_registration_id',
        'match_status',
        'raw_json',
    ];

    protected $casts = [
        'amount' => 'integer',
        'matched_registration_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The camp registration this payment was matched to (if any).
     */
    public function registration(): BelongsTo
    {
        return $this->belongsTo(CampRegistration::class, 'matched_registration_id');
    }
}
