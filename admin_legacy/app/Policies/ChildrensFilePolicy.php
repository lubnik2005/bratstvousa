<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ChildrensFile;
use Illuminate\Auth\Access\Response;

class ChildrensFilePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view childrens_files');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ChildrensFile $childrensFile): bool
    {
        return $user->hasPermissionTo('view childrens_files');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create childrens_files');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ChildrensFile $childrensFile): bool
    {
        return $user->hasPermissionTo('edit childrens_files');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ChildrensFile $childrensFile): bool
    {
        return $user->hasPermissionTo('delete childrens_files');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ChildrensFile $childrensFile): bool
    {
        // Optionally reuse the 'delete' permission
        return $user->hasPermissionTo('delete childrens_files');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ChildrensFile $childrensFile): bool
    {
        // Optionally reuse the 'delete' permission
        return $user->hasPermissionTo('delete childrens_files');
    }
}

