<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ZeffyPayment;

class ZeffyPaymentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view zeffy_payments');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ZeffyPayment $zeffyPayment): bool
    {
        return $user->hasPermissionTo('view zeffy_payments');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create zeffy_payments');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ZeffyPayment $zeffyPayment): bool
    {
        return $user->hasPermissionTo('edit zeffy_payments');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ZeffyPayment $zeffyPayment): bool
    {
        return $user->hasPermissionTo('delete zeffy_payments');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ZeffyPayment $zeffyPayment): bool
    {
        return $user->hasPermissionTo('delete zeffy_payments');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ZeffyPayment $zeffyPayment): bool
    {
        return $user->hasPermissionTo('delete zeffy_payments');
    }
}
