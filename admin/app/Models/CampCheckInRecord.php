<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampCheckInRecord extends Model
{
    protected $connection = 'd1';

    protected $table = 'camp_check_ins';

    public $timestamps = false;

    protected $fillable = [
        'registration_id',
        'zeffy_ticket_id',
        'zeffy_payment_id',
        'checked_in_at',
        'checked_in_by',
        'source',
        'is_repeat',
        'note',
        'request_id',
    ];

    protected $casts = [
        'checked_in_at' => 'datetime',
        'is_repeat' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function registration(): BelongsTo
    {
        return $this->belongsTo(CampRegistration::class, 'registration_id');
    }
}
