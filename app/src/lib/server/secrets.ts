// src/lib/server/config.ts
import { env } from '$env/dynamic/private';
import { Resource } from 'sst';


export function getDatabaseUrl(): string {
  // Prefer SST-linked secret; fall back to plain env
  return Resource.DATABASE_URL?.value ?? env.DATABASE_URL ?? '';
}

export function getMediaUrl(): string {
  // Prefer SST-linked secret; fall back to plain env
  return Resource.MEDIA_URL?.value ?? env.MEDIA_URL ?? '';
}

/** Safely read a secret: prefer SST Resource, fall back to plain env */
function read(name: keyof typeof env, res?: { value?: string } | null): string {
  return (res?.value ?? env[name] ?? "").toString();
}

/** Parse an integer env; returns defaultValue if missing/invalid */
function readInt(name: keyof typeof env, res?: { value?: string } | null, defaultValue = 0): number {
  const raw = read(name, res);
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : defaultValue;
}

export function getSecret() {
  return {
    // ── Core app URLs ────────────────────────────────────────────────────────────
    media_url: read("MEDIA_URL", Resource.MEDIA_URL),
    database_url: read("DATABASE_URL", Resource.DATABASE_URL),
    admin_url: read("ADMIN_URL", Resource.ADMIN_URL),

    // ── App email targets ───────────────────────────────────────────────────────
    mail_info_user: read("MAIL_INFO_USER", Resource.MAIL_INFO_USER),

    // ── AWS SDK creds/region/bucket (prefer IAM role; fall back to env/secrets) ─
    aws: {
      region: read("AWS_DEFAULT_REGION", Resource.AWS_DEFAULT_REGION),
      accessKeyId: read("AWS_ACCESS_KEY_ID", Resource.AWS_ACCESS_KEY_ID),
      secretAccessKey: read("AWS_SECRET_ACCESS_KEY", Resource.AWS_SECRET_ACCESS_KEY),
      bucketName: read("AWS_BUCKET_NAME", Resource.AWS_BUCKET_NAME),
    },

    // ── SMTP / email transport ──────────────────────────────────────────────────
    smtp: {
      host: read("SMTP_HOST", Resource.SMTP_HOST),
      port: readInt("SMTP_PORT", Resource.SMTP_PORT, 587),
      user: read("SMTP_USER", Resource.SMTP_USER),
      password: read("SMTP_PASSWORD", Resource.SMTP_PASSWORD), // note: you used SMTP_PASSWORD
      from: read("SMTP_FROM", Resource.SMTP_FROM),
    },
  };
}

/** Optional: named exports for convenience */
// export const Secrets = getSecret();


