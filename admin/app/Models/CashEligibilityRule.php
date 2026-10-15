<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable;

class CashEligibilityRule extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    /**
     * The cash_eligibility_rules table lives in the shared Cloudflare D1
     * database (owned by the SvelteKit Drizzle schema), so pin this model to
     * the "d1" connection.
     */
    protected $connection = 'd1';

    protected $table = 'cash_eligibility_rules';

    protected $fillable = [
        'scope_type',
        'church_id',
        'event_slug',
        'amount_cents',
        'discount_code',
        'zeffy_campaign_id',
        'active',
    ];

    protected $casts = [
        'church_id' => 'integer',
        'amount_cents' => 'integer',
        'active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $rule): void {
            // D1's PDO adapter cannot bind a nullable FK on insert. Event-wide
            // rules intentionally omit church_id, which lets SQLite use NULL.
            if ($rule->scope_type === 'event' && $rule->church_id === null) {
                unset($rule->attributes['church_id']);
            }
        });
    }

    /**
     * The church this rule authorizes for cash payment.
     */
    public function church(): BelongsTo
    {
        return $this->belongsTo(Church::class, 'church_id');
    }
}
