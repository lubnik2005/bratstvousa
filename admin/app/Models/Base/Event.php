<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use Spatie\Image\Image;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Advoor\NovaEditorJs\NovaEditorJsCast;

class Event extends Model implements Auditable, HasMedia
{
    use InteractsWithMedia;
    use \OwenIt\Auditing\Auditable;

    protected $casts = [
        'start_at' => 'date',
        'end_at' => 'date',
        'date' => 'date',
        'editorjs' => NovaEditorJsCast::class,
    ];

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('gallery_thumbnails')
            ->nonQueued()
            ->width(300)
            ->height(300);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('gallery_thumbnails');
        $this->addMediaCollection('gallery');
        $this->addMediaCollection('featured_document')->singleFile();
    }

    /**
     * Add an image to the gallery and store its dimensions.
     *
     * @param  \Illuminate\Http\UploadedFile|string  $file
     * @param  string  $collection
     * @return Media
     */
    public function addImageWithDimensions($file, $collection = 'gallery')
    {
        $media = $this->addMedia($file)->toMediaCollection($collection);

        // Calculate and store dimensions
        $this->storeImageDimensions($media);

        return $media;
    }
}
