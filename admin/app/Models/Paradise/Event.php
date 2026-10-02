<?php

namespace App\Models\Paradise;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Event extends Model
{
    protected $connection = 'd1_paradise';

    protected $table = 'paradise_events';

    protected $fillable = [
        'name',
        'status',
        'start_on',
        'end_on',
        'registration_start_at',
        'registration_end_at',
        'refund_percentage',
        'refunds_available_until',
        'description',
        'zeffy_campaign_id',
        'zeffy_ticketing_url',
    ];

    protected $casts = [
        'refund_percentage' => 'integer',
        'start_on' => 'datetime',
        'end_on' => 'datetime',
        'registration_start_at' => 'datetime',
        'registration_end_at' => 'datetime',
        'refunds_available_until' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function rooms(): BelongsToMany
    {
        return $this->belongsToMany(Room::class, 'paradise_event_rooms', 'event_id', 'room_id')
            ->withPivot('price')
            ->withTimestamps();
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'event_id');
    }

    /** Campers holding a reservation for this event (via paradise_reservations). */
    public function attendees(): HasManyThrough
    {
        return $this->hasManyThrough(
            Attendee::class,
            Reservation::class,
            'event_id',     // reservations.event_id
            'id',           // attendees.id
            'id',           // events.id
            'attendee_id'   // reservations.attendee_id
        )->whereNull('paradise_reservations.deleted_at');
    }

    public function ledgerEntries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class, 'event_id');
    }

    public function formAnswers(): HasMany
    {
        return $this->hasMany(FormAnswer::class, 'event_id');
    }

    public function zeffyPayments(): HasMany
    {
        return $this->hasMany(ZeffyPayment::class, 'event_id');
    }
}
