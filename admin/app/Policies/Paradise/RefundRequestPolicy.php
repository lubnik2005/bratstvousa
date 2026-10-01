<?php

namespace App\Policies\Paradise;

use App\Models\Paradise\RefundRequest;
use App\Models\User;

class RefundRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view paradise_refund_requests');
    }

    public function view(User $user, RefundRequest $request): bool
    {
        return $user->hasPermissionTo('view paradise_refund_requests');
    }

    // Requests are only created by campers from the portal.
    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, RefundRequest $request): bool
    {
        return $user->hasPermissionTo('edit paradise_refund_requests');
    }

    public function delete(User $user, RefundRequest $request): bool
    {
        return $user->hasPermissionTo('delete paradise_refund_requests');
    }

    public function restore(User $user, RefundRequest $request): bool
    {
        return false;
    }

    public function forceDelete(User $user, RefundRequest $request): bool
    {
        return false;
    }
}
