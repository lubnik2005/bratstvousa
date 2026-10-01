<?php

namespace App\Models\Paradise;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RefundRequest extends Model
{
    protected $connection = 'd1_paradise';

    protected $table = 'paradise_refund_requests';

    protected $fillable = [
        'attendee_id',
        'email',
        'amount_cents',
        'balance_cents',
        'note',
        'status',
    ];

    protected $casts = [
        'attendee_id' => 'integer',
        'amount_cents' => 'integer',
        'balance_cents' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function attendee(): BelongsTo
    {
        return $this->belongsTo(Attendee::class, 'attendee_id');
    }
}
