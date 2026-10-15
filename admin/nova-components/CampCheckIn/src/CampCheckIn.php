<?php

namespace Bratstvo\CampCheckIn;

use Illuminate\Http\Request;
use Laravel\Nova\Menu\MenuSection;
use Laravel\Nova\Nova;
use Laravel\Nova\Tool;

class CampCheckIn extends Tool
{
    public function boot(): void
    {
        Nova::mix('camp-check-in', __DIR__.'/../dist/mix-manifest.json');
    }

    public function menu(Request $request): MenuSection
    {
        return MenuSection::make('Camp Check-In')
            ->path('/camp-check-in')
            ->icon('qr-code')
            ->canSee(fn (Request $request) => $request->user()?->hasPermissionTo('view camp_registrations')
                && $request->user()?->hasPermissionTo('edit camp_registrations'));
    }
}
