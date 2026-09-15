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

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'cot_id');
    }
}
