<?php

namespace App\Models\Paradise;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventRoom extends Model
{
    protected $connection = 'd1_paradise';

    protected $table = 'paradise_event_rooms';

    protected $fillable = [
        'event_id',
        'room_id',
        'price',
    ];

    protected $casts = [
        'event_id' => 'integer',
        'room_id' => 'integer',
        'price' => 'integer',
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
}
