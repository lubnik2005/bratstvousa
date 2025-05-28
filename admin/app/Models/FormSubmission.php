<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'content' => 'array', 'date_of_birth' => 'date'
        ];
    }

    public function church() {
        return $this->belongsTo(Church::class);
    }

}
