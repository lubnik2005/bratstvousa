<?php

namespace App\Policies\Paradise;

use App\Models\Paradise\Form;
use App\Models\User;

class FormPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view paradise_forms');
    }

    public function view(User $user, Form $form): bool
    {
        return $user->hasPermissionTo('view paradise_forms');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create paradise_forms');
    }

    public function update(User $user, Form $form): bool
    {
        return $user->hasPermissionTo('edit paradise_forms');
    }

    public function delete(User $user, Form $form): bool
    {
        return $user->hasPermissionTo('delete paradise_forms');
    }

    public function restore(User $user, Form $form): bool
    {
        return $user->hasPermissionTo('delete paradise_forms');
    }

    public function forceDelete(User $user, Form $form): bool
    {
        return $user->hasPermissionTo('delete paradise_forms');
    }
}
