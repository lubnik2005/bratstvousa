<?php

namespace App\Policies;

use App\Models\User;
use App\Models\YouthEvent;
use Illuminate\Auth\Access\Response;

class YouthEventPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view youth_events');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, YouthEvent $youthEvent): bool
    {
        return $user->hasPermissionTo('view youth_events');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create youth_events');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, YouthEvent $youthEvent): bool
    {
        return $user->hasPermissionTo('edit youth_events');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, YouthEvent $youthEvent): bool
    {
        return $user->hasPermissionTo('delete youth_events');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, YouthEvent $youthEvent): bool
    {
        return $user->hasPermissionTo('restore youth_events');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, YouthEvent $youthEvent): bool
    {
        return $user->hasPermissionTo('forceDelete youth_events');
    }
}
