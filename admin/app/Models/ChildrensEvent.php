<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChildrensEvent extends Model
{
    //
    protected $casts = ['start_at' => 'date', 'end_at' => 'date'];
}
