<?php

namespace App\Policies;

use App\Models\User;
use App\Models\GospelEvent;
use Illuminate\Auth\Access\Response;

class GospelEventPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view gospel_events');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, GospelEvent $gospelEvent): bool
    {
        return $user->hasPermissionTo('view gospel_events');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create gospel_events');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, GospelEvent $gospelEvent): bool
    {
        return $user->hasPermissionTo('edit gospel_events');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, GospelEvent $gospelEvent): bool
    {
        return $user->hasPermissionTo('delete gospel_events');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, GospelEvent $gospelEvent): bool
    {
        // Optionally reuse the 'delete' permission
        return $user->hasPermissionTo('delete gospel_events');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, GospelEvent $gospelEvent): bool
    {
        // Optionally reuse the 'delete' permission
        return $user->hasPermissionTo('delete gospel_events');
    }
}


