<?php

namespace App\Models\Paradise;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    protected $connection = 'd1_paradise';

    protected $table = 'paradise_rooms';

    protected $fillable = [
        'name',
        'sex',
        'size',
        'location',
        'type',
        'deleted_at',
    ];

    protected $casts = [
        'size' => 'integer',
        'deleted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function cots(): HasMany
    {
        return $this->hasMany(Cot::class, 'room_id');
    }

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class, 'paradise_event_rooms', 'room_id', 'event_id')
            ->withPivot('price');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'room_id');
    }
}
