<?php

namespace App\Providers;

use Dniccum\NovaDocumentation\NovaDocumentation;
use Ferdiunal\NovaSettings\NovaSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Laravel\Nova\Menu\MenuGroup;
use Laravel\Nova\Menu\MenuItem;
use Laravel\Nova\Menu\MenuSection;
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

        Nova::mainMenu(fn (Request $request) => $this->mainMenu($request));
    }

    /**
     * Build the sidebar. Nova's default lumps every resource under a single
     * "Resources" heading; we group them by the site/product they belong to.
     * Each item still honours its resource policy via MenuSection::resource().
     *
     * @return array<int, \Laravel\Nova\Menu\MenuSection>
     */
    protected function mainMenu(Request $request): array
    {
        return array_values(array_filter([
            MenuSection::dashboard(\App\Nova\Dashboards\Main::class)->icon('chart-bar'),

            MenuSection::make('Bratstvo USA', [
                MenuGroup::make('Events', [
                    MenuItem::resource(\App\Nova\GeneralEvent::class),
                    MenuItem::resource(\App\Nova\YouthEvent::class),
                    MenuItem::resource(\App\Nova\ChildrensEvent::class),
                    MenuItem::resource(\App\Nova\FamilyEvent::class),
                    MenuItem::resource(\App\Nova\GospelEvent::class),
                    MenuItem::resource(\App\Nova\MusicEvent::class),
                    MenuItem::resource(\App\Nova\BibleEducationEvent::class),
                ]),
                MenuGroup::make('News', [
                    MenuItem::resource(\App\Nova\NewsArticle::class),
                    MenuItem::resource(\App\Nova\YouthNewsArticle::class),
                    MenuItem::resource(\App\Nova\ChildrensNewsArticle::class),
                    MenuItem::resource(\App\Nova\FamilyNewsArticle::class),
                    MenuItem::resource(\App\Nova\MusicNewsArticle::class),
                    MenuItem::resource(\App\Nova\BibleEducationNewsArticle::class),
                ]),
                MenuGroup::make('Content', [
                    MenuItem::resource(\App\Nova\Church::class),
                    MenuItem::resource(\App\Nova\ChildrensFile::class),
                    MenuItem::resource(\App\Nova\ChildrensFileCategory::class),
                    MenuItem::resource(\App\Nova\FormSubmission::class),
                ]),
            ])->icon('globe-alt')->collapsable(),

            MenuSection::make('North-West Camps', [
                MenuItem::resource(\App\Nova\CampRegistration::class),
                MenuItem::lens(\App\Nova\CampRegistration::class, \App\Nova\Lenses\CashReconciliation::class)
                    ->canSee(fn ($request) => \App\Nova\CampRegistration::authorizedToViewAny($request)),
                MenuItem::resource(\App\Nova\CashEligibilityRule::class),
                MenuItem::resource(\App\Nova\ZeffyPayment::class),
                MenuItem::resource(\App\Nova\YouthLeader::class),
                MenuItem::resource(\App\Nova\EmailLog::class),
            ])->icon('ticket')->collapsable(),

            MenuSection::make('Camp Paradise', [
                MenuItem::resource(\App\Nova\Paradise\Event::class),
                MenuItem::resource(\App\Nova\Paradise\Reservation::class),
                MenuItem::resource(\App\Nova\Paradise\Room::class),
                MenuItem::resource(\App\Nova\Paradise\Cot::class),
                MenuItem::resource(\App\Nova\Paradise\Form::class),
                MenuItem::resource(\App\Nova\Paradise\FormAnswer::class),
            ])->icon('home')->collapsable(),

            MenuSection::make('Administration', [
                MenuItem::resource(\App\Nova\User::class),
                MenuItem::resource(\Pktharindu\NovaPermissions\Nova\Role::class),
                MenuItem::resource(\App\Nova\AuditLog::class),
            ])->icon('shield-check')->collapsable(),

            (new NovaSettings)->menu($request),
            (new NovaDocumentation)->menu($request),
        ]));
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
