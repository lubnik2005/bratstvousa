<?php

namespace App\Policies\Paradise;

use App\Models\Paradise\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view paradise_events');
    }

    public function view(User $user, Event $event): bool
    {
        return $user->hasPermissionTo('view paradise_events');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create paradise_events');
    }

    public function update(User $user, Event $event): bool
    {
        return $user->hasPermissionTo('edit paradise_events');
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->hasPermissionTo('delete paradise_events');
    }

    public function restore(User $user, Event $event): bool
    {
        return $user->hasPermissionTo('delete paradise_events');
    }

    public function forceDelete(User $user, Event $event): bool
    {
        return $user->hasPermissionTo('delete paradise_events');
    }
}
