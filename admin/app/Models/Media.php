<?php

namespace App\Models;

use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

/**
 * The `media` table lives in the shared Cloudflare D1 database (part of the
 * SvelteKit app's Drizzle schema), not the local "plumbing" SQLite default
 * connection. Pin Spatie's media model to the "d1" connection.
 */
class Media extends BaseMedia
{
    protected $connection = 'd1';
}
