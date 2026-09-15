<?php

namespace App\Policies\Paradise;

use App\Models\Paradise\Room;
use App\Models\User;

class RoomPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view paradise_rooms');
    }

    public function view(User $user, Room $room): bool
    {
        return $user->hasPermissionTo('view paradise_rooms');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create paradise_rooms');
    }

    public function update(User $user, Room $room): bool
    {
        return $user->hasPermissionTo('edit paradise_rooms');
    }

    public function delete(User $user, Room $room): bool
    {
        return $user->hasPermissionTo('delete paradise_rooms');
    }

    public function restore(User $user, Room $room): bool
    {
        return $user->hasPermissionTo('delete paradise_rooms');
    }

    public function forceDelete(User $user, Room $room): bool
    {
        return $user->hasPermissionTo('delete paradise_rooms');
    }
}
