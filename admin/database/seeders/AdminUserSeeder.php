<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Pktharindu\NovaPermissions\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed a superadmin role (all permissions) + an admin user.
     *
     * Idempotent: safe to run repeatedly. Credentials come from env:
     *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
     *
     * Nova auth lives on the "plumbing" SQLite connection (the default).
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@bratstvousa.org');
        $password = env('ADMIN_PASSWORD', 'changeme');
        $name = env('ADMIN_NAME', 'Administrator');

        // 1. Superadmin role with EVERY permission slug from config.
        $role = Role::firstOrCreate(
            ['slug' => 'superadmin'],
            ['name' => 'Super Admin']
        );

        $slugs = array_keys(config('nova-permissions.permissions', []));
        $now = now();
        $rows = [];
        foreach ($slugs as $slug) {
            $rows[] = [
                'role_id' => $role->id,
                'permission_slug' => $slug,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Reset + reinsert this role's permissions so it always has the full set.
        DB::table('role_permission')->where('role_id', $role->id)->delete();
        if ($rows) {
            DB::table('role_permission')->insert($rows);
        }

        // 2. Admin user.
        $user = User::updateOrCreate(
            ['email' => $email],
            ['name' => $name, 'password' => Hash::make($password)]
        );

        // 3. Assign role (avoid duplicate pivot).
        if (! $user->roles()->where('roles.id', $role->id)->exists()) {
            $user->roles()->attach($role->id);
        }

        $this->command->info("Admin user ready: {$email} (role: superadmin, ".count($slugs).' permissions)');
    }
}
