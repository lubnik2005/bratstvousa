<?php

namespace App\Policies\Paradise;

use App\Models\Paradise\Attendee;
use App\Models\User;

class AttendeePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view paradise_attendees');
    }

    public function view(User $user, Attendee $attendee): bool
    {
        return $user->hasPermissionTo('view paradise_attendees');
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Attendee $attendee): bool
    {
        return false;
    }

    public function delete(User $user, Attendee $attendee): bool
    {
        return false;
    }

    public function restore(User $user, Attendee $attendee): bool
    {
        return false;
    }

    public function forceDelete(User $user, Attendee $attendee): bool
    {
        return false;
    }
}
