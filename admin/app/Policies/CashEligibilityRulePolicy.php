<?php

namespace App\Policies;

use App\Models\CashEligibilityRule;
use App\Models\User;

class CashEligibilityRulePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view cash_eligibility_rules');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CashEligibilityRule $cashEligibilityRule): bool
    {
        return $user->hasPermissionTo('view cash_eligibility_rules');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create cash_eligibility_rules');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CashEligibilityRule $cashEligibilityRule): bool
    {
        return $user->hasPermissionTo('edit cash_eligibility_rules');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CashEligibilityRule $cashEligibilityRule): bool
    {
        return $user->hasPermissionTo('delete cash_eligibility_rules');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CashEligibilityRule $cashEligibilityRule): bool
    {
        return $user->hasPermissionTo('delete cash_eligibility_rules');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CashEligibilityRule $cashEligibilityRule): bool
    {
        return $user->hasPermissionTo('delete cash_eligibility_rules');
    }
}
