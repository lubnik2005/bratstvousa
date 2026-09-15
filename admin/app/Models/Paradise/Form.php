<?php

namespace App\Models\Paradise;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    protected $connection = 'd1_paradise';

    protected $table = 'paradise_forms';

    protected $fillable = [
        'name',
        'required',
        'questions',
    ];

    protected $casts = [
        'required' => 'boolean',
        'questions' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
