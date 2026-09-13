<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OwenIt\Auditing\Contracts\Auditable;

class YouthLeader extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    /**
     * The youth_leaders table lives in the shared Cloudflare D1 database
     * (owned by the SvelteKit Drizzle schema), so pin this model to the
     * "d1" connection.
     */
    protected $connection = 'd1';

    protected $table = 'youth_leaders';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'city',
        'region',
        'church_id',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'church_id' => 'integer',
    ];

    /**
     * Camp registrations this leader is responsible for approving.
     */
    public function campRegistrations(): HasMany
    {
        return $this->hasMany(CampRegistration::class, 'leader_id');
    }
}
