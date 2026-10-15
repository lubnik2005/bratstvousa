<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

    protected static function booted(): void
    {
        static::deleted(function (self $checkIn): void {
            try {
                $registration = CampRegistration::find($checkIn->registration_id);
                if (! $registration) {
                    return;
                }

                $firstRemaining = self::query()
                    ->where('registration_id', $registration->id)
                    ->orderBy('checked_in_at')
                    ->first();

                if ($firstRemaining) {
                    $registration->checkin_status = 'CHECKED_IN';
                    $registration->checked_in_at = $firstRemaining->checked_in_at;
                    $registration->checked_in_by = $firstRemaining->checked_in_by;
                } else {
                    $registration->checkin_status = 'NOT_CHECKED_IN';
                    $registration->checked_in_at = null;
                    $registration->checked_in_by = null;
                }
                $registration->save();

                $actor = Auth::user();
                DB::connection('d1')->table('registration_events')->insert([
                    'registration_id' => $registration->id,
                    'event' => 'check_in_record_deleted',
                    'amount_cents' => null,
                    'staff_user' => $actor ? ($actor->name.' (#'.$actor->getKey().')') : 'unknown',
                    'payload' => json_encode([
                        'check_in_id' => $checkIn->id,
                        'checked_in_at' => $checkIn->checked_in_at?->toIso8601String(),
                        'checked_in_by' => $checkIn->checked_in_by,
                        'source' => $checkIn->source,
                        'is_repeat' => $checkIn->is_repeat,
                    ]),
                    'created_at' => now()->toIso8601String(),
                ]);
            } catch (\Throwable $e) {
                Log::error('Camp check-in record deletion cleanup failed', ['check_in_id' => $checkIn->id, 'error' => $e->getMessage()]);
            }
        });
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(CampRegistration::class, 'registration_id');
    }
}
