<?php

namespace App\Console\Commands;

use App\Models\Paradise\Reservation;
use Illuminate\Console\Command;

class ParadiseReleaseHolds extends Command
{
    /**
     * @var string
     */
    protected $signature = 'paradise:release-holds';

    /**
     * @var string
     */
    protected $description = 'Cancel Camp Paradise reservations whose 5-minute hold has expired.';

    public function handle(): int
    {
        $now = now()->toIso8601String();

        $count = Reservation::on('d1_paradise')
            ->where('status', 'held')
            ->where('held_until', '<', $now)
            ->update([
                'status' => 'cancelled',
                'updated_at' => $now,
            ]);

        $this->info('paradise:release-holds done: released='.$count.'.');

        return self::SUCCESS;
    }
}
