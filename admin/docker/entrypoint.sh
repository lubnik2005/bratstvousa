#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

echo "[entrypoint] Starting admin container bootstrap..."

# ---------------------------------------------------------------------------
# 1. Plumbing SQLite database (Nova users/roles/permissions/audits/sessions).
#    Lives on a persistent volume mounted at /var/www/html/database/data.
#    IMPORTANT: the volume mounts ONLY the data/ subdir, not the whole
#    database/ dir, so image-shipped migrations (database/migrations-plumbing)
#    are never shadowed by stale volume contents.
#    D1 (content) is remote and NOT migrated here.
# ---------------------------------------------------------------------------
PLUMBING_DB="${PLUMBING_DB_DATABASE:-/var/www/html/database/data/plumbing.sqlite}"
mkdir -p "$(dirname "$PLUMBING_DB")"
if [ ! -f "$PLUMBING_DB" ]; then
    echo "[entrypoint] Creating plumbing SQLite at $PLUMBING_DB"
    touch "$PLUMBING_DB"
fi
chown -R www-data:www-data "$(dirname "$PLUMBING_DB")"

# ---------------------------------------------------------------------------
# 2. Writable dirs + storage symlink
# ---------------------------------------------------------------------------
mkdir -p storage/framework/{sessions,views,cache/data} storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
[ -L public/storage ] || gosu www-data php artisan storage:link || true

# ---------------------------------------------------------------------------
# 3. Run ONLY the plumbing migrations against the plumbing connection.
#    (Content tables are owned by the SvelteKit Drizzle schema on D1.)
# ---------------------------------------------------------------------------
echo "[entrypoint] Migrating plumbing database..."
gosu www-data php artisan migrate \
    --database=plumbing \
    --path=database/migrations-plumbing \
    --force

# ---------------------------------------------------------------------------
# 4. Seed the admin user / superadmin role (idempotent).
#    Skips gracefully if ADMIN_PASSWORD is unset.
# ---------------------------------------------------------------------------
if [ -n "${ADMIN_PASSWORD:-}" ]; then
    echo "[entrypoint] Seeding admin user..."
    gosu www-data php artisan db:seed --class=AdminUserSeeder --force
else
    echo "[entrypoint] ADMIN_PASSWORD not set; skipping admin seed."
fi

# ---------------------------------------------------------------------------
# 5. Framework caches (config/route/view/event) for production speed.
#    Cleared first so stale build-time cache never leaks in.
# ---------------------------------------------------------------------------
echo "[entrypoint] Building framework caches..."
gosu www-data php artisan optimize:clear
gosu www-data php artisan config:cache
gosu www-data php artisan route:cache || true
gosu www-data php artisan view:cache || true

echo "[entrypoint] Bootstrap complete. Handing off to: $*"
exec "$@"
