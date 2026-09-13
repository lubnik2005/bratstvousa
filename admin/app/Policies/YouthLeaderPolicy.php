<?php

namespace App\Policies;

use App\Models\User;
use App\Models\YouthLeader;

class YouthLeaderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view youth_leaders');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, YouthLeader $youthLeader): bool
    {
        return $user->hasPermissionTo('view youth_leaders');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create youth_leaders');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, YouthLeader $youthLeader): bool
    {
        return $user->hasPermissionTo('edit youth_leaders');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, YouthLeader $youthLeader): bool
    {
        return $user->hasPermissionTo('delete youth_leaders');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, YouthLeader $youthLeader): bool
    {
        return $user->hasPermissionTo('delete youth_leaders');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, YouthLeader $youthLeader): bool
    {
        return $user->hasPermissionTo('delete youth_leaders');
    }
}
