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
        $db->extend('d1', function ($config, $name) {
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
        });
        $db->purge('d1');
    }
}
