<?php

namespace App\Policies\Paradise;

use App\Models\Paradise\LedgerEntry;
use App\Models\User;

class LedgerEntryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view paradise_ledger');
    }

    public function view(User $user, LedgerEntry $entry): bool
    {
        return $user->hasPermissionTo('view paradise_ledger');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create paradise_ledger');
    }

    public function update(User $user, LedgerEntry $entry): bool
    {
        return false;
    }

    public function delete(User $user, LedgerEntry $entry): bool
    {
        return false;
    }

    public function restore(User $user, LedgerEntry $entry): bool
    {
        return false;
    }

    public function forceDelete(User $user, LedgerEntry $entry): bool
    {
        return false;
    }
}
