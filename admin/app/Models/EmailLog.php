<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    /**
     * The email_log table lives in the shared Cloudflare D1 database
     * (written by the SvelteKit app on every send), so pin this model to
     * the "d1" connection.
     */
    protected $connection = 'd1';

    protected $table = 'email_log';

    protected $fillable = [
        'to_email',
        'subject',
        'html',
        'status',
        'attempts',
        'last_error',
    ];

    protected $casts = [
        'attempts' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
