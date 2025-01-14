<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class YouthEvent extends Model implements HasMedia
{
    use InteractsWithMedia;

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('gallery_thumbnails')
            ->width(130)
            ->height(130);
    }

    public function registerMediaCollections(): void
    {
        // $this->addMediaCollection('main')->singleFile();
        $this->addMediaCollection('gallery');
    }

    protected $casts = ['start_at' => 'date', 'end_at' => 'date'];
}
