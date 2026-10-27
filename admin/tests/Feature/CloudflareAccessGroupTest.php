<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\CloudflareAccessGroup;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CloudflareAccessGroupTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.connections.plumbing.database' => ':memory:',
            'cloudflare-access.account_id' => 'test-account',
            'cloudflare-access.api_token' => 'test-token',
            'cloudflare-access.group_id' => 'test-group',
        ]);
        DB::purge('plumbing');
        Schema::connection('plumbing')->create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('password');
            $table->timestamps();
        });
        Http::preventStrayRequests();
    }

    public function test_unconfigured_sync_does_not_make_requests(): void
    {
        config(['cloudflare-access.api_token' => null]);
        Http::fake();

        app(CloudflareAccessGroup::class)->reconcile();

        Http::assertNothingSent();
    }

    public function test_reconcile_normalizes_users_and_preserves_group_restrictions(): void
    {
        $this->createUser('First@example.com');
        $this->createUser('first@example.com');
        $this->createUser('second@example.com');
        $this->fakeGroup();

        app(CloudflareAccessGroup::class)->reconcile();

        Http::assertSent(fn (Request $request): bool => $request->method() === 'PUT'
            && $request->hasHeader('Authorization', 'Bearer test-token')
            && $request['name'] === 'Nova users'
            && $request['include'] === [
                ['email' => ['email' => 'first@example.com']],
                ['email' => ['email' => 'second@example.com']],
            ]
            && $request['exclude'] === [['email' => ['email' => 'blocked@example.com']]]
            && $request['require'] === [['email_domain' => ['domain' => 'example.com']]]);
        Http::assertSentCount(2);
    }

    public function test_user_lifecycle_updates_group_membership(): void
    {
        $this->fakeGroup();
        $user = User::create(['name' => 'Test user', 'email' => 'old@example.com', 'password' => 'test-password']);
        $user->update(['email' => 'new@example.com']);
        $user->delete();

        foreach (['old@example.com', 'new@example.com'] as $email) {
            Http::assertSent(fn (Request $request): bool => $request->method() === 'PUT'
                && $request['include'] === [['email' => ['email' => $email]]]);
        }
        Http::assertSent(fn (Request $request): bool => $request->method() === 'PUT' && $request['include'] === []);
        Http::assertSentCount(6);
    }

    public function test_failed_api_request_makes_command_fail(): void
    {
        Http::fake(['api.cloudflare.com/*' => Http::response(['success' => false], 503)]);

        $this->artisan('cloudflare-access:reconcile')->assertFailed();

        Http::assertNotSent(fn (Request $request): bool => $request->method() === 'PUT');
    }

    private function createUser(string $email): void
    {
        User::withoutEvents(fn () => User::create([
            'name' => 'Test user',
            'email' => $email,
            'password' => 'test-password',
        ]));
    }

    private function fakeGroup(): void
    {
        Http::fake(['api.cloudflare.com/*' => Http::response(['result' => [
            'name' => 'Nova users',
            'include' => [['email' => ['email' => 'stale@example.com']]],
            'exclude' => [['email' => ['email' => 'blocked@example.com']]],
            'require' => [['email_domain' => ['domain' => 'example.com']]],
        ]])]);
    }
}
