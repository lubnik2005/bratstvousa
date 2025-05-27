<?php

namespace App\Policies;

use App\Models\ChildrensFileCategory;
use App\Models\User;

class ChildrensFileCategoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view childrens_file_category');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ChildrensFileCategory $childrensFileCategory): bool
    {
        return $user->hasPermissionTo('view childrens_file_category');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create childrens_file_category');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ChildrensFileCategory $childrensFileCategory): bool
    {
        return $user->hasPermissionTo('edit childrens_file_category');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ChildrensFileCategory $childrensFileCategory): bool
    {
        return $user->hasPermissionTo('delete childrens_file_category');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ChildrensFileCategory $childrensFileCategory): bool
    {
        return $user->hasPermissionTo('delete childrens_file_category');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ChildrensFileCategory $childrensFileCategory): bool
    {
        return $user->hasPermissionTo('delete childrens_file_category');
    }
}
