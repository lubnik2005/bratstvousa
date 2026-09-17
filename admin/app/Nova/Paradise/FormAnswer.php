<?php

namespace App\Nova\Paradise;

use App\Nova\Resource;
use Laravel\Nova\Actions\ExportAsCsv;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\Code;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\KeyValue;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class FormAnswer extends Resource
{
    /**
     * @var class-string<\App\Models\Paradise\FormAnswer>
     */
    public static $model = \App\Models\Paradise\FormAnswer::class;

    public static $title = 'email';

    public static $search = ['id', 'email'];

    public static $group = 'Camp Paradise';

    public static function uriKey(): string
    {
        return 'paradise-form-answers';
    }

    public static $indexDefaultOrder = [
        'created_at' => 'desc',
    ];

    public static function label(): string
    {
        return 'Paradise Form Answers';
    }

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('Email')
                ->sortable()
                ->rules('nullable', 'email', 'max:255'),

            BelongsTo::make('Form', 'form', Form::class)->nullable()->sortable(),
            BelongsTo::make('Event', 'event', Event::class)->nullable()->hideFromIndex(),
            BelongsTo::make('Reservation', 'reservation', Reservation::class)->nullable()->hideFromIndex(),

            Text::make('Is Minor', function () {
                $v = $this->answers['isMinor'] ?? null;
                if ($v === 'true' || $v === true) {
                    return 'Minor';
                }
                if ($v === 'false' || $v === false) {
                    return 'Adult';
                }

                return 'n/a';
            })->sortable(false),

            Boolean::make('Adult', function () {
                $v = $this->answers['isMinor'] ?? null;

                return $v === 'false' || $v === false;
            })->exceptOnForms(),

            KeyValue::make('Answers (formatted)', function () {
                return $this->formattedAnswers();
            })->onlyOnDetail(),

            Code::make('Answers (raw)', 'answers')
                ->json()
                ->onlyOnDetail(),

            DateTime::make('Signed On', 'signed_on')
                ->exceptOnForms(),
        ];
    }

    /**
     * Map the legacy health-form answer keys to human-readable labels/values.
     *
     * @return array<string, string>
     */
    protected function formattedAnswers(): array
    {
        $a = is_array($this->answers) ? $this->answers : [];

        $yesNo = static function ($v): string {
            if ($v === 'true' || $v === true) {
                return 'Yes';
            }
            if ($v === 'false' || $v === false) {
                return 'No';
            }

            return '—';
        };
        $str = static fn ($v): string => is_string($v) && $v !== '' ? $v : '—';

        $isMinor = ($a['isMinor'] ?? null) === 'true' || ($a['isMinor'] ?? null) === true;

        $out = [
            'Age' => $isMinor ? 'Under 18' : ((($a['isMinor'] ?? null) === 'false') ? '18+' : '—'),
        ];

        if ($isMinor) {
            $immun = [
                'none' => 'No immunizations',
                'up-to-date' => 'Up to date including tetanus',
                'tetanus' => 'Only tetanus',
            ];
            $out['Medical problems'] = ($a['hasMedicalProblems'] ?? null) === 'true' ? $str($a['medicalProblems'] ?? null) : 'None';
            $out['Immunizations'] = $immun[$a['immunizations'] ?? ''] ?? '—';
            $out['Allergies'] = ($a['hasAllergies'] ?? null) === 'true' ? $str($a['allergies'] ?? null) : 'None';
            if (($a['hasMedicines'] ?? null) === 'true') {
                $out['Medicine dose'] = $str($a['medicineDose'] ?? null);
                $out['Medicine frequency'] = $str($a['medicineFrequency'] ?? null);
                $out['Able to take on own'] = $yesNo($a['medicineAbility'] ?? null);
            } else {
                $out['Medicines'] = 'None';
            }
            $out["Minor's full name"] = $str($a['minorFullName'] ?? null);
            $out['Parent/Guardian full name'] = $str($a['guardianFullName'] ?? null);
            $out['Parent/Guardian phone'] = $str($a['guardianPhone'] ?? null);
        }

        $out['Waiver signed'] = $isMinor
            ? 'Waiver and Release Form (Minor 0-17 years)'
            : 'Consent and Release Form (Adult 18 years +)';

        return $out;
    }

    public function cards(NovaRequest $request): array
    {
        return [];
    }

    public function filters(NovaRequest $request): array
    {
        return [];
    }

    public function lenses(NovaRequest $request): array
    {
        return [];
    }

    public function actions(NovaRequest $request): array
    {
        return [ExportAsCsv::make()];
    }
}
