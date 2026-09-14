<?php

namespace App\Settings;

/**
 * Raw (identity) encoder/decoder for spatie/laravel-settings.
 *
 * The settings live in the shared Cloudflare D1 `settings` table, whose
 * `payload` column stores PLAIN STRINGS (the SvelteKit frontend reads them
 * raw and renders with {@html}, without JSON.parse). Spatie's default codec
 * json_encodes/json_decodes the payload, which is incompatible with those
 * raw values (json_decode('<p>...') returns null).
 *
 * This codec stores/reads the value as-is so both the Nova admin and the
 * SvelteKit frontend agree on the payload format. Non-string values are
 * coerced to string on encode (all current settings are strings).
 *
 * NOTE: referenced from config/settings.php as an [class, method] callable
 * array (NOT a closure) so `php artisan config:cache` still works.
 */
class RawSettingsCodec
{
    /**
     * Encode a value for storage. Strings are stored verbatim.
     */
    public static function encode(mixed $value): string
    {
        if (is_string($value)) {
            return $value;
        }

        if (is_null($value)) {
            return '';
        }

        if (is_bool($value)) {
            return $value ? '1' : '0';
        }

        if (is_scalar($value)) {
            return (string) $value;
        }

        // Fallback for arrays/objects: keep them representable.
        return json_encode($value);
    }

    /**
     * Decode a stored payload. Returns the raw string as-is.
     *
     * @param  bool  $associative  Unused; kept for signature compatibility
     *                             with spatie's decoder contract.
     */
    public static function decode(?string $payload, bool $associative = false): mixed
    {
        return $payload ?? '';
    }
}
