<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\URL;
use OwenIt\Auditing\Contracts\Auditable;
use Pktharindu\NovaPermissions\Traits\HasRoles;

class User extends Authenticatable implements Auditable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    use \OwenIt\Auditing\Auditable;

    /**
     * Nova auth lives in the local "plumbing" SQLite DB, not the shared
     * Cloudflare D1. Keeps admin login fast + transactional.
     *
     * @var string
     */
    protected $connection = 'plumbing';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Send the password reset notification, building the reset URL from
     * Nova's named route instead of Laravel's default "password.reset"
     * (which is not registered — Nova registers "nova.pages.password.reset").
     * Without this override the reset notification throws
     * RouteNotFoundException: Route [password.reset] not defined.
     */
    public function sendPasswordResetNotification($token): void
    {
        $notification = new ResetPassword($token);

        $notification->createUrlUsing(function ($notifiable, string $token) {
            return URL::route('nova.pages.password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ]);
        });

        $this->notify($notification);
    }
}
