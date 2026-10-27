<?php

namespace App\Console\Commands;

use App\Services\CloudflareAccessGroup;
use Illuminate\Console\Command;
use Throwable;

class ReconcileCloudflareAccessUsers extends Command
{
    protected $signature = 'cloudflare-access:reconcile';

    protected $description = 'Reconcile Nova user emails into the Cloudflare Access group.';

    public function handle(CloudflareAccessGroup $accessGroup): int
    {
        if (! $accessGroup->isConfigured()) {
            $this->warn('Cloudflare Access synchronization is not configured.');

            return self::SUCCESS;
        }

        try {
            $accessGroup->reconcile();
        } catch (Throwable $exception) {
            report($exception);
            $this->error('Cloudflare Access reconciliation failed.');

            return self::FAILURE;
        }

        $this->info('Cloudflare Access group reconciled.');

        return self::SUCCESS;
    }
}
