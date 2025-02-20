<?php

namespace App\Nova;

use Ebess\AdvancedNovaMediaLibrary\Fields\Files;
use Ebess\AdvancedNovaMediaLibrary\Fields\Images;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Slug;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Actions\ExportAsCsv;

class SharedFields
{
    public static function eventFields()
    {
        $disk = config('filesystems.default');

        return [
            ID::make()->sortable(),
            Text::make('Title')->rules('required')->required(),
            Slug::make('Slug')->from('title'),
            Text::make('Description'),
            Date::make('Start At'),
            Select::make('Region')->options(['all' => 'Все', 'central' => 'Центральный регион', 'east' => 'Восточный регион', 'california' => 'Калифорнийский регион', 'north-west' => 'Северо-Западный регион'])->nullable(),
            Date::make('End At'),
            Image::make('Featured Image')->disk($disk)->path('/upfiles/page'),
            Image::make('Thumbnail')->disk($disk)->path('/upfiles/page'),
            Trix::make('Content')->withFiles($disk)->path('/upfiles/page'),
            Images::make('Gallery', 'gallery') // Media collection name: 'gallery'
                ->nullable()
                ->showDimensions() // Display dimensions directly
                ->conversionOnDetailView('gallery_thumbnails') // Conversion for detail view
                ->conversionOnIndexView('gallery_thumbnails') // Conversion for index view
                ->conversionOnForm('gallery_thumbnails') // Conversion for form view
                ->fullSize(), // Allow full-size viewing in a column
            Files::make('Playlist', 'playlist'),
            Files::make('Documents', 'documents'),
            Files::make('Featured Document', 'featured_document')->help('For certain types of resoures, this will appear as the main file to download to get more information about an event.'),
        ];
    }
}
