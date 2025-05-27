<?php

namespace App\Policies;

use App\Models\MusicEvent;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MusicEventPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view music_events');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MusicEvent $musicEvent): bool
    {
        return $user->hasPermissionTo('view music_events');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create music_events');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, MusicEvent $musicEvent): bool
    {
        return $user->hasPermissionTo('edit music_events');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MusicEvent $musicEvent): bool
    {
        return $user->hasPermissionTo('delete music_events');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, MusicEvent $musicEvent): bool
    {
        // Optionally reuse the 'delete' permission
        return $user->hasPermissionTo('delete music_events');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, MusicEvent $musicEvent): bool
    {
        // Optionally reuse the 'delete' permission
        return $user->hasPermissionTo('delete music_events');
    }
}

