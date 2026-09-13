<?php

namespace App\Policies;

use App\Models\CampRegistration;
use App\Models\User;

class CampRegistrationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view camp_registrations');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CampRegistration $campRegistration): bool
    {
        return $user->hasPermissionTo('view camp_registrations');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create camp_registrations');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CampRegistration $campRegistration): bool
    {
        return $user->hasPermissionTo('edit camp_registrations');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CampRegistration $campRegistration): bool
    {
        return $user->hasPermissionTo('delete camp_registrations');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CampRegistration $campRegistration): bool
    {
        return $user->hasPermissionTo('delete camp_registrations');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CampRegistration $campRegistration): bool
    {
        return $user->hasPermissionTo('delete camp_registrations');
    }
}
