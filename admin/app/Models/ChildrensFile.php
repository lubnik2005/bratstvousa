<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ChildrensFile extends Model
{
    //
    protected $casts = ['start_at' => 'date', 'end_at' => 'date'];

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ChildrensFileCategory::class);
    }
}
