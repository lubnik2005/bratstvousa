<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable;

class CampRegistration extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    /**
     * The camp_registrations table lives in the shared Cloudflare D1 database
     * (owned by the SvelteKit Drizzle schema), so pin this model to the
     * "d1" connection.
     */
    protected $connection = 'd1';

    protected $table = 'camp_registrations';

    protected $fillable = [
        'event_slug',
        'first_name',
        'last_name',
        'church',
        'email',
        'phone',
        'leader_id',
        'status',
        'payment_status',
        'amount',
        'stripe_session_id',
        'confirmation_code',
        'approval_token',
        'approved_by',
        'approved_at',
        'zeffy_payment_id',
        'paid_at',
    ];

    protected $casts = [
        'leader_id' => 'integer',
        'amount' => 'integer',
        'approved_at' => 'datetime',
        'paid_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The youth leader responsible for approving this registration.
     */
    public function youthLeader(): BelongsTo
    {
        return $this->belongsTo(YouthLeader::class, 'leader_id');
    }
}
