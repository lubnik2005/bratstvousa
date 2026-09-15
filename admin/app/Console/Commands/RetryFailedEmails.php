<?php

namespace App\Console\Commands;

use App\Models\EmailLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RetryFailedEmails extends Command
{
    /**
     * @var string
     */
    protected $signature = 'emails:retry';

    /**
     * @var string
     */
    protected $description = 'Resend emails logged as failed (Resend free tier safety net).';

    private const API_URL = 'https://api.resend.com/emails';

    private const MAX_ATTEMPTS = 3;

    private const PER_RUN = 50;

    public function handle(): int
    {
        $apiKey = env('RESEND_API_KEY');
        if (! $apiKey) {
            $this->error('RESEND_API_KEY is not configured.');

            return self::FAILURE;
        }

        $fromName = env('MAIL_FROM_NAME', 'Bratstvo USA');
        $fromEmail = env('MAIL_FROM_ADDRESS', 'noreply@bratstvousa.com');
        $from = $fromName.' <'.$fromEmail.'>';

        $rows = EmailLog::query()
            ->where('status', 'failed')
            ->where('attempts', '<', self::MAX_ATTEMPTS)
            ->orderBy('id')
            ->limit(self::PER_RUN)
            ->get();

        $this->info('emails:retry starting ('.$rows->count().' candidates).');

        $sent = 0;
        $failed = 0;

        foreach ($rows as $row) {
            try {
                $response = Http::withToken($apiKey)
                    ->acceptJson()
                    ->timeout(30)
                    ->post(self::API_URL, [
                        'from' => $from,
                        'to' => [$row->to_email],
                        'subject' => $row->subject,
                        'html' => $row->html,
                    ]);

                if ($response->successful()) {
                    $row->status = 'sent';
                    $row->attempts = $row->attempts + 1;
                    $row->save();
                    $sent++;
                } else {
                    $row->attempts = $row->attempts + 1;
                    $row->last_error = 'HTTP '.$response->status().': '.$response->body();
                    $row->save();
                    $failed++;
                }
            } catch (\Throwable $e) {
                $row->attempts = $row->attempts + 1;
                $row->last_error = $e->getMessage();
                $row->save();
                $failed++;
                Log::error('emails:retry send failed', ['id' => $row->id, 'error' => $e->getMessage()]);
            }
        }

        $this->info('emails:retry done: sent='.$sent.' still_failed='.$failed.'.');

        return self::SUCCESS;
    }
}
