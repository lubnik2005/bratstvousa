<?php

namespace App\Providers;

use Dniccum\NovaDocumentation\NovaDocumentation;
use Ferdiunal\NovaSettings\NovaSettings;
use Illuminate\Support\Facades\Gate;
use Laravel\Nova\Nova;
use Laravel\Nova\NovaApplicationServiceProvider;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        // Nova's default auto-discovery only scans the top level of app/Nova,
        // not subdirectories. Explicitly register the Camp Paradise resources
        // that live under app/Nova/Paradise.
        Nova::resources([
            \App\Nova\Paradise\Event::class,
            \App\Nova\Paradise\Room::class,
            \App\Nova\Paradise\Cot::class,
            \App\Nova\Paradise\Reservation::class,
            \App\Nova\Paradise\Form::class,
            \App\Nova\Paradise\FormAnswer::class,
        ]);
    }

    /**
     * Register the Nova routes.
     *
     * @return void
     */
    protected function routes()
    {
        Nova::routes()
            ->withAuthenticationRoutes()
            ->withPasswordResetRoutes()
            ->register();
    }

    /**
     * Register the Nova gate.
     *
     * This gate determines who can access Nova in non-local environments.
     *
     * @return void
     */
    protected function gate()
    {
        Gate::define('viewNova', function ($user) {
            // Any user with at least one assigned role may access Nova.
            // Per-resource visibility is still enforced by the policies
            // via hasPermissionTo('view {table}'). An empty allow-list
            // here would lock everyone out, including the seeded admin.
            return $user->roles()->exists();
        });
    }

    /**
     * Get the dashboards that should be listed in the Nova sidebar.
     *
     * @return array
     */
    protected function dashboards()
    {
        return [
            new \App\Nova\Dashboards\Main,
        ];
    }

    /**
     * Get the tools that should be listed in the Nova sidebar.
     *
     * @return array
     */
    public function tools()
    {
        return [
            new NovaSettings,
            new \Pktharindu\NovaPermissions\NovaPermissions,
            new NovaDocumentation,
        ];
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        parent::register();
    }
}
