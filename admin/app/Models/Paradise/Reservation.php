<?php

namespace App\Models\Paradise;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $connection = 'd1_paradise';

    protected $table = 'paradise_reservations';

    protected $fillable = [
        'event_id',
        'room_id',
        'cot_id',
        'first_name',
        'last_name',
        'email',
        'sex',
        'status',
        'held_until',
        'price',
        'confirmation_code',
        'stripe_payment_intent',
        'paid_at',
        'deleted_at',
    ];

    protected $casts = [
        'event_id' => 'integer',
        'room_id' => 'integer',
        'cot_id' => 'integer',
        'price' => 'integer',
        'held_until' => 'datetime',
        'paid_at' => 'datetime',
        'deleted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function cot(): BelongsTo
    {
        return $this->belongsTo(Cot::class, 'cot_id');
    }
}
