<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ChildrensFileCategory extends Model
{
    protected $connection = 'd1';

    public function files(): BelongsToMany
    {
        return $this->belongsToMany(ChildrensFile::class);
    }
}
