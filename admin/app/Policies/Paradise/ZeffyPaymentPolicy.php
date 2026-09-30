<?php

namespace App\Policies\Paradise;

use App\Models\Paradise\ZeffyPayment;
use App\Models\User;

class ZeffyPaymentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view paradise_zeffy_payments');
    }

    public function view(User $user, ZeffyPayment $payment): bool
    {
        return $user->hasPermissionTo('view paradise_zeffy_payments');
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, ZeffyPayment $payment): bool
    {
        return $user->hasPermissionTo('edit paradise_zeffy_payments');
    }

    public function delete(User $user, ZeffyPayment $payment): bool
    {
        return false;
    }

    public function restore(User $user, ZeffyPayment $payment): bool
    {
        return false;
    }

    public function forceDelete(User $user, ZeffyPayment $payment): bool
    {
        return false;
    }
}
