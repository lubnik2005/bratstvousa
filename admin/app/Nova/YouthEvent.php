<?php

namespace App\Nova;

use Ebess\AdvancedNovaMediaLibrary\Fields\Images;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Slug;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Http\Requests\NovaRequest;

class YouthEvent extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\YouthEvent>
     */
    public static $model = \App\Models\YouthEvent::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'id';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
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
            Date::make('Start At'),
            Select::make('Region')->options(['all' => 'Все', 'central' => 'Центральный регион', 'east' => 'Восточный регион', 'california' => 'Калифорнийский регион', 'north-west' => 'Северо-Западный регион'])->nullable(),
            Date::make('End At'),
            // Images::make('Featured Image', 'featured_image'),//->croppable(true),//->disk('upfiles'),
            // Images::make('Main image', 'main') // second parameter is the media collection name
            // ->conversionOnIndexView('thumb') // conversion used to display the image
            // ->croppingConfigs(['aspectRatio' => 16/9])->mustCrop(), // validation rules
            // Image::make('Featured Image')->disk($disk),
            Image::make('Featured Image', 'featured_image')->disk($disk)->path('/upfiles/page'),
            // Image::make('Featured Image', 'featured_image')
            //     ->store(function (NovaRequest $request, $model) {
            //         try {
            //             Storage::disk('s3')->put('test_file.txt', 'This is a test');
            //             // dd( $request->file('featured_image')->store('look_here/some_id_thing.png', 's3'));
            //             $model->featured_image = $request->file('featured_image')->store('/look_here', 's3');
            //             $model->save(); // Save the model if the upload was successful
            //
            //             // Success
            //             return response()->json(['success' => true, 'message' => 'File uploaded successfully']);
            //         } catch (\Exception $e) {
            //             // Failure
            //             return response()->json(['success' => false, 'message' => 'File upload failed', 'error' => $e->getMessage()], 500);
            //         }
            //     }),

            Image::make('Thumbnail')->disk($disk)->path('/upfiles/page'),
            Trix::make('Content')->withFiles($disk)->path('/upfiles/page'),
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
        return [];
    }
}
