<?php

namespace App\Models\Paradise;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormAnswer extends Model
{
    protected $connection = 'd1_paradise';

    protected $table = 'paradise_form_answers';

    protected $fillable = [
        'form_id',
        'event_id',
        'reservation_id',
        'email',
        'answers',
        'signed_on',
    ];

    protected $casts = [
        'form_id' => 'integer',
        'event_id' => 'integer',
        'reservation_id' => 'integer',
        'answers' => 'array',
        'signed_on' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class, 'form_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class, 'reservation_id');
    }
}
