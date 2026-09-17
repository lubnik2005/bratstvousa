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
        'church_id',
        'email',
        'phone',
        'leader_id',
        'status',
        'payment_status',
        'payment_method',
        'cash_eligible',
        'fee_waived',
        'amount',
        'event_price_cents',
        'amount_due_cents',
        'amount_paid_cents',
        'stripe_session_id',
        'confirmation_code',
        'approval_token',
        'approved_by',
        'approved_at',
        'zeffy_payment_id',
        'zeffy_ticket_id',
        'zeffy_contact_id',
        'zeffy_campaign_id',
        'zeffy_discount_code',
        'paid_at',
        'paid_by',
        'checkin_status',
        'checked_in_at',
        'checked_in_by',
    ];

    protected $casts = [
        'leader_id' => 'integer',
        'church_id' => 'integer',
        'amount' => 'integer',
        'event_price_cents' => 'integer',
        'amount_due_cents' => 'integer',
        'amount_paid_cents' => 'integer',
        'cash_eligible' => 'boolean',
        'fee_waived' => 'boolean',
        'approved_at' => 'datetime',
        'paid_at' => 'datetime',
        'checked_in_at' => 'datetime',
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

    /**
     * The church this registrant belongs to (real FK captured at registration).
     * Named churchModel to avoid clashing with the free-text `church` attribute.
     */
    public function churchModel(): BelongsTo
    {
        return $this->belongsTo(Church::class, 'church_id');
    }
}
