<?php

namespace App\Nova\Traits;

use Ebess\AdvancedNovaMediaLibrary\Fields\Files;
use Ebess\AdvancedNovaMediaLibrary\Fields\Images;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Slug;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Fields\File;
use Laravel\Nova\Fields\URL;
use Laravel\Nova\Fields\Boolean;
use Advoor\NovaEditorJs\NovaEditorJsField;

class SharedFields
{
    public static function eventFields()
    {
        $disk = config('filesystems.default');

        return [
            ID::make()->sortable(),
            URL::make('Url Link', function ($resource) {
                return 'localhost:5173/test/' . $resource->slug;
            })->onlyOnDetail(),
            Text::make('Title')->rules('required')->required(),
            Slug::make('Slug')->from('title'),
            Text::make('Description'),
            Date::make('Start At'),
            Select::make('Region')->options(['all' => 'Все', 'central' => 'Центральный регион', 'east' => 'Восточный регион', 'california' => 'Калифорнийский регион', 'north-west' => 'Северо-Западный регион'])->nullable()->displayUsingLabels(),
            Date::make('End At'),
            Image::make('Featured Image', 'featured_image', $disk)->deletable(true)->prunable(),
            // Image::make('Thumbnail')->disk($disk)->path('/upfiles/page'),
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
            Boolean::make('Use EditorJS', 'use_editorjs'),
            NovaEditorJsField::make('EditorJS', 'editorjs'),
        ];
    }

    public static function articleFields(){
        $disk = config('filesystems.default');
        return [
            ID::make()->sortable(),
            Text::make('Title')->rules('required')->required(),
            Slug::make('Slug')->from('title'),
            Text::make('Description'),
            Date::make('Date'),
            Image::make('Featured Image', 'featured_image', $disk)->path('upfiles/news'),
            // Image::make('Thumbnail', 'thumbnail', $disk)->path('/upfiles/page'),
            Trix::make('Content')->withFiles($disk)->path('/upfiles/page')
                ->fillUsing(function ($request, $model, $attribute, $requestAttribute) {
                    $content = $request->input($requestAttribute);
                    // Replace any width attribute with width="100%"
                    $content = preg_replace('/width="[^"]*"/', 'width="100%"', $content);
                    $content = preg_replace('/height="[^"]*"/', '', $content);
                    // Set the modified value
                    $model->{$attribute} = $content;
                }),
            Images::make('Gallery', 'gallery') // Media collection name: 'gallery'
                ->nullable()
                ->showDimensions() // Display dimensions directly
                ->conversionOnDetailView('gallery_thumbnails') // Conversion for detail view
                ->conversionOnIndexView('gallery_thumbnails') // Conversion for index view
                ->conversionOnForm('gallery_thumbnails') // Conversion for form view
                ->fullSize(), // Allow full-size viewing in a column
            Files::make('Playlist', 'playlist'),
            Files::make('Documents', 'documents'),
            File::make('Featured Document', 'featured_document', $disk)->path('/upfiles/page')->help('For certain types of resoures, this will appear as the main file to download to get more information about an event.'),
            Boolean::make('Use EditorJS', 'use_editorjs'),
            NovaEditorJsField::make('EditorJS', 'editorjs'),

        ];
    }
}
