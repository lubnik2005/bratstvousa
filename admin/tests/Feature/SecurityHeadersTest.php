<?php

namespace Tests\Feature;

use Tests\TestCase;

class SecurityHeadersTest extends TestCase
{
    public function test_login_and_guest_redirect_are_hardened_without_disabling_the_scanner(): void
    {
        foreach (['/', '/login'] as $path) {
            $response = $this->get('https://localhost'.$path);

            if ($path === '/login') {
                $response->assertOk();
            } else {
                $response->assertRedirect(route('nova.login'));
            }

            $response->assertHeader('X-Content-Type-Options', 'nosniff');
            $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
            $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            $response->assertHeader('Strict-Transport-Security', 'max-age=31536000');
            $response->assertHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
            $response->assertHeader('Content-Security-Policy', "frame-ancestors 'self'; base-uri 'self'");
        }
    }

    public function test_plain_http_does_not_advertise_hsts(): void
    {
        $this->get('http://localhost/')->assertHeaderMissing('Strict-Transport-Security');
    }

    public function test_guest_cannot_read_admin_resource_data(): void
    {
        $this->getJson('/nova-api/youth-events')->assertUnauthorized();
        $this->getJson('/nova-api/camp-registrations')->assertUnauthorized();
    }
}
