<?php

namespace App\Nova;

use Ebess\AdvancedNovaMediaLibrary\Fields\Files;
use Ebess\AdvancedNovaMediaLibrary\Fields\Images;
use Illuminate\Http\Request;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\File;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Slug;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Http\Requests\NovaRequest;

class NewsArticle extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\NewsArticle>
     */
    public static $model = \App\Models\NewsArticle::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'title';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
        'title',
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        $disk = config('filesystems.default');

        return [
            ID::make()->sortable(),
            Text::make('Title')->rules('required')->required(),
            Slug::make('Slug')->from('title'),
            Text::make('Description'),
            Date::make('Date'),
            Image::make('Featured Image', 'featured_image')->disk($disk)->path('upfiles/news'),
            Image::make('Thumbnail')->disk($disk)->path('/upfiles/page'),
            Trix::make('Content')->withFiles($disk)->path('/upfiles/page')
                ->fillUsing(function ($request, $model, $attribute, $requestAttribute) {
                    $content = $request->input($requestAttribute);
                    // Replace any width attribute with width="100%"
                    $content = preg_replace('/width="[^"]*"/', 'width="100%"', $content);
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
            File::make('Featured Document', 'featured_document')->disk($disk)->path('/upfiles/page')->help('For certain types of resoures, this will appear as the main file to download to get more information about an event.'),
        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @return array
     */
    public function cards(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @return array
     */
    public function filters(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @return array
     */
    public function lenses(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @return array
     */
    public function actions(NovaRequest $request)
    {
        return [ExportAsCsv::make()];
    }
}
