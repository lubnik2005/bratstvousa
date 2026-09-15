<?php

namespace App\Policies\Paradise;

use App\Models\Paradise\Reservation;
use App\Models\User;

class ReservationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view paradise_reservations');
    }

    public function view(User $user, Reservation $reservation): bool
    {
        return $user->hasPermissionTo('view paradise_reservations');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create paradise_reservations');
    }

    public function update(User $user, Reservation $reservation): bool
    {
        return $user->hasPermissionTo('edit paradise_reservations');
    }

    public function delete(User $user, Reservation $reservation): bool
    {
        return $user->hasPermissionTo('delete paradise_reservations');
    }

    public function restore(User $user, Reservation $reservation): bool
    {
        return $user->hasPermissionTo('delete paradise_reservations');
    }

    public function forceDelete(User $user, Reservation $reservation): bool
    {
        return $user->hasPermissionTo('delete paradise_reservations');
    }
}
