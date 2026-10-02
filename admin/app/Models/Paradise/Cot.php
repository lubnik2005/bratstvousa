<?php

namespace App\Models\Paradise;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cot extends Model
{
    protected $connection = 'd1_paradise';

    protected $table = 'paradise_cots';

    protected $fillable = [
        'room_id',
        'description',
    ];

    protected $casts = [
        'room_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Display label, e.g. "Lodge 300 Room 301 · Cot 1" (many beds share names).
     */
    public function getTitleAttribute(): string
    {
        $roomName = $this->room?->name ?? "Room {$this->room_id}";

        return "{$roomName} · {$this->description}";
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'cot_id');
    }
}
