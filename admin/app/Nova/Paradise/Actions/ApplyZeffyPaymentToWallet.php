<?php

namespace App\Nova\Paradise\Actions;

use App\Models\Paradise\ZeffyPayment;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Fields\ActionFields;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Credits the buyer's wallet for a succeeded Zeffy payment (idempotent).
 *
 * Typical use: a payment arrived as "unmatched" (no buyer email or a typo),
 * the admin fixes the Buyer Email on the payment, then runs this action.
 */
class ApplyZeffyPaymentToWallet extends Action
{
    public $name = 'Apply to wallet';

    public $confirmText = 'Credit the buyer wallet for the selected succeeded payment(s)? Already-credited payments are skipped.';

    public $confirmButtonText = 'Apply';

    /**
     * @param  Collection<int, ZeffyPayment>  $models
     */
    public function handle(ActionFields $fields, Collection $models): mixed
    {
        $credited = 0;
        $cents = 0;
        $already = 0;
        $skipped = 0;

        foreach ($models as $payment) {
            if (($payment->status ?? '') !== 'succeeded' || empty($payment->buyer_email)) {
                $skipped++;

                continue;
            }

            $amount = $payment->applyToWallet();

            if ($amount > 0) {
                $credited++;
                $cents += $amount;
            } else {
                $already++;
            }
        }

        if ($credited === 0) {
            return Action::danger(
                "No payments applied ({$already} already applied, {$skipped} skipped). "
                .'Check the status is "succeeded" and a buyer email is set.'
            );
        }

        $dollars = number_format($cents / 100, 2);

        return Action::message(
            "Credited \${$dollars} to {$credited} wallet(s); {$already} already applied; {$skipped} skipped."
        );
    }

    public function fields(NovaRequest $request): array
    {
        return [];
    }
}
