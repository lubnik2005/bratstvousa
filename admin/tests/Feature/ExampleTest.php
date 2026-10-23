<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_guests_are_redirected_to_the_admin_login(): void
    {
        $response = $this->get('/');

        $response->assertRedirect(route('nova.login'));
    }
}
