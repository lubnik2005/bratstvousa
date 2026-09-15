<?php

namespace App\Policies\Paradise;

use App\Models\Paradise\Cot;
use App\Models\User;

class CotPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view paradise_cots');
    }

    public function view(User $user, Cot $cot): bool
    {
        return $user->hasPermissionTo('view paradise_cots');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create paradise_cots');
    }

    public function update(User $user, Cot $cot): bool
    {
        return $user->hasPermissionTo('edit paradise_cots');
    }

    public function delete(User $user, Cot $cot): bool
    {
        return $user->hasPermissionTo('delete paradise_cots');
    }

    public function restore(User $user, Cot $cot): bool
    {
        return $user->hasPermissionTo('delete paradise_cots');
    }

    public function forceDelete(User $user, Cot $cot): bool
    {
        return $user->hasPermissionTo('delete paradise_cots');
    }
}
