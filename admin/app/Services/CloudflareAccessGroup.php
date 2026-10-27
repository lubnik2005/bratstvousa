<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class CloudflareAccessGroup
{
    public function reconcile(): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $group = $this->request()->get($this->groupUrl())->throw()->json('result');
        if (! is_array($group)) {
            throw new RuntimeException('Cloudflare Access returned an invalid group response.');
        }

        $emails = User::query()
            ->orderBy('id')
            ->pluck('email')
            ->filter(fn (mixed $email): bool => is_string($email) && $email !== '')
            ->map(fn (string $email): string => mb_strtolower($email))
            ->unique()
            ->values()
            ->all();

        $group['include'] = array_map(
            fn (string $email): array => ['email' => ['email' => $email]],
            $emails,
        );

        // Cloudflare's Access group endpoint replaces the group with PUT;
        // PATCH is rejected for API-token authentication.
        $this->request()->put($this->groupUrl(), [
            'name' => $group['name'],
            'include' => $group['include'],
            'exclude' => $group['exclude'] ?? [],
            'require' => $group['require'] ?? [],
        ])->throw();
    }

    public function isConfigured(): bool
    {
        return filled(config('cloudflare-access.account_id'))
            && filled(config('cloudflare-access.api_token'))
            && filled(config('cloudflare-access.group_id'));
    }

    private function request(): PendingRequest
    {
        return Http::baseUrl((string) config('cloudflare-access.api_url'))
            ->acceptJson()
            ->withToken((string) config('cloudflare-access.api_token'))
            ->retry(3, 250)
            ->timeout(15);
    }

    private function groupUrl(): string
    {
        return sprintf(
            'accounts/%s/access/groups/%s',
            config('cloudflare-access.account_id'),
            config('cloudflare-access.group_id'),
        );
    }
}
