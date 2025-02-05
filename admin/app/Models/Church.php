<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Church extends Model
{
    protected $casts = ['longitude' => 'float', 'latitude' => 'float'];
}
