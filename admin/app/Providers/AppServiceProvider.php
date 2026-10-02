<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Pktharindu\NovaPermissions\Traits\ValidatesPermissions;

class AppServiceProvider extends ServiceProvider
{
    use ValidatesPermissions;

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // $this->registerPolicies();

        // Pin Camp Paradise models to their policies. Auto-discovery otherwise
        // resolves App\Models\Paradise\ZeffyPayment to the top-level
        // App\Policies\ZeffyPaymentPolicy (same basename) and the index 500s.
        $paradisePolicies = [
            \App\Models\Paradise\Attendee::class => \App\Policies\Paradise\AttendeePolicy::class,
            \App\Models\Paradise\Cot::class => \App\Policies\Paradise\CotPolicy::class,
            \App\Models\Paradise\Event::class => \App\Policies\Paradise\EventPolicy::class,
            \App\Models\Paradise\Form::class => \App\Policies\Paradise\FormPolicy::class,
            \App\Models\Paradise\LedgerEntry::class => \App\Policies\Paradise\LedgerEntryPolicy::class,
            \App\Models\Paradise\RefundRequest::class => \App\Policies\Paradise\RefundRequestPolicy::class,
            \App\Models\Paradise\Reservation::class => \App\Policies\Paradise\ReservationPolicy::class,
            \App\Models\Paradise\Room::class => \App\Policies\Paradise\RoomPolicy::class,
            \App\Models\Paradise\ZeffyPayment::class => \App\Policies\Paradise\ZeffyPaymentPolicy::class,
            \App\Models\ZeffyPayment::class => \App\Policies\ZeffyPaymentPolicy::class,
        ];
        foreach ($paradisePolicies as $model => $policy) {
            Gate::policy($model, $policy);
        }

        foreach (config('nova-permissions.permissions') as $key => $permissions) {
            Gate::define($key, function (User $user) use ($key) {
                if ($this->nobodyHasAccess($key)) {
                    return true;
                }

                return $user->hasPermissionTo($key);
            });
        }

        // Re-register the "d1" database driver AFTER renoki-co/l1's service
        // provider so DatabaseManager resolves our subclass. The vendor
        // D1Connection inherits Illuminate's Connection::cursor(), which loops
        // PDOStatement->fetch() — a method the D1 PDO shim does not implement,
        // so Nova global search (which streams results via cursor()) 500s. Our
        // App\Database\D1Connection overrides cursor() to fall back to a
        // non-streaming select(). The closure mirrors L1ServiceProvider's.
        //
        // Note: extend the resolved DatabaseManager directly (not via
        // app->resolving) so this wins even after "db" has been resolved, and
        // purge any already-built "d1" connection so it is rebuilt with our
        // subclass on next use.
        $db = $this->app->make('db');
        $d1Resolver = function ($config, $name) {
            $config['name'] = $name;

            return new \App\Database\D1Connection(
                new \RenokiCo\L1\CloudflareD1Connector(
                    $config['database'],
                    $config['auth']['token'],
                    $config['auth']['account_id'],
                    $config['api'] ?? 'https://api.cloudflare.com/client/v4',
                ),
                $config,
            );
        };
        $db->extend('d1', $d1Resolver);
        $db->purge('d1');

        // The Camp Paradise app has its own D1 database on a second connection.
        // Same subclass (cursor() + transaction neutralization) applies.
        $db->extend('d1_paradise', $d1Resolver);
        $db->purge('d1_paradise');
    }
}
