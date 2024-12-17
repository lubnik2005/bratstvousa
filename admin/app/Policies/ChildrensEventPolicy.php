<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ChildrensEvent;
use Illuminate\Auth\Access\Response;

class ChildrensEventPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view childrens_events');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ChildrensEvent $childrensEvent): bool
    {
        return $user->hasPermissionTo('view childrens_events');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create childrens_events');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ChildrensEvent $childrensEvent): bool
    {
        return $user->hasPermissionTo('edit childrens_events');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ChildrensEvent $childrensEvent): bool
    {
        return $user->hasPermissionTo('delete childrens_events');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ChildrensEvent $childrensEvent): bool
    {
        // You can add a separate permission for restoring if desired
        // or reuse the 'delete' permission as shown:
        return $user->hasPermissionTo('delete childrens_events');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ChildrensEvent $childrensEvent): bool
    {
        // You can add a separate permission for force deleting if desired
        // or reuse the 'delete' permission as shown:
        return $user->hasPermissionTo('delete childrens_events');
    }
}

