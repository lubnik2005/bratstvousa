<?php

namespace App\Policies;

use App\Models\User;
use App\Models\BibleEducationEvent;
use Illuminate\Auth\Access\Response;

class BibleEducationEventPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view bible_education_events');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, BibleEducationEvent $bibleEducationEvent): bool
    {
        return $user->hasPermissionTo('view bible_education_events');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create bible_education_events');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, BibleEducationEvent $bibleEducationEvent): bool
    {
        return $user->hasPermissionTo('edit bible_education_events');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, BibleEducationEvent $bibleEducationEvent): bool
    {
        return $user->hasPermissionTo('delete bible_education_events');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, BibleEducationEvent $bibleEducationEvent): bool
    {
        // Optionally reuse the 'delete' permission
        return $user->hasPermissionTo('delete bible_education_events');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, BibleEducationEvent $bibleEducationEvent): bool
    {
        // Optionally reuse the 'delete' permission
        return $user->hasPermissionTo('delete bible_education_events');
    }
}


