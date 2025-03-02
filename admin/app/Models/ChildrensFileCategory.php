<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChildrensFileCategory extends Model
{
    public function files(): BelongsToMany
    {
        return $this->belongsToMany(ChildrensFile::class);
    }
}
