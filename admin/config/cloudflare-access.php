<?php

return [
    'account_id' => env('CLOUDFLARE_ACCESS_ACCOUNT_ID'),
    'api_token' => env('CLOUDFLARE_ACCESS_API_TOKEN'),
    'group_id' => env('CLOUDFLARE_ACCESS_GROUP_ID'),
    'api_url' => env('CLOUDFLARE_ACCESS_API_URL', 'https://api.cloudflare.com/client/v4'),
];
