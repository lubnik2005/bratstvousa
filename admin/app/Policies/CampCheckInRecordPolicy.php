<?php

namespace App\Policies;

use App\Models\CampCheckInRecord;
use App\Models\User;

class CampCheckInRecordPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canUseScanner($user);
    }

    public function view(User $user, CampCheckInRecord $checkIn): bool
    {
        return $this->canUseScanner($user);
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, CampCheckInRecord $checkIn): bool
    {
        return false;
    }

    public function delete(User $user, CampCheckInRecord $checkIn): bool
    {
        return $this->canUseScanner($user);
    }

    private function canUseScanner(User $user): bool
    {
        return $user->hasPermissionTo('view camp_registrations')
            && $user->hasPermissionTo('edit camp_registrations');
    }
}
