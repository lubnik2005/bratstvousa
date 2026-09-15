<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Reconcile Zeffy payments hourly (safety net for the SvelteKit webhook).
Schedule::command('zeffy:sync')->hourly()->withoutOverlapping();

// Retry emails logged as failed (Resend free-tier safety net).
Schedule::command('emails:retry')->hourly()->withoutOverlapping();

// Release expired Camp Paradise bed holds hourly.
Schedule::command('paradise:release-holds')->hourly()->withoutOverlapping();
