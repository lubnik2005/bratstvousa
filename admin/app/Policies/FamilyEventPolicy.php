<?php

namespace App\Policies;

use App\Models\User;
use App\Models\FamilyEvent;
use Illuminate\Auth\Access\Response;

class FamilyEventPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view family_events');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, FamilyEvent $familyEvent): bool
    {
        return $user->hasPermissionTo('view family_events');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create family_events');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, FamilyEvent $familyEvent): bool
    {
        return $user->hasPermissionTo('edit family_events');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, FamilyEvent $familyEvent): bool
    {
        return $user->hasPermissionTo('delete family_events');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, FamilyEvent $familyEvent): bool
    {
        // Optionally reuse the 'delete' permission
        return $user->hasPermissionTo('delete family_events');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, FamilyEvent $familyEvent): bool
    {
        // Optionally reuse the 'delete' permission
        return $user->hasPermissionTo('delete family_events');
    }
}

