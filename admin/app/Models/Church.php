<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Church extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $casts = ['longitude' => 'float', 'latitude' => 'float'];
}
