# Bratstvo Nova Admin

Laravel Nova administration for Bratstvo USA. Content data is stored in Cloudflare D1, media is stored in Cloudflare R2, and Nova's users, roles, permissions, audits, sessions, and cache live in a local SQLite volume.

## Production

The live admin is `https://admin.bratstvousa.com`. It runs on `nautilus` in `/home/bruh/bratstvo-admin`.

```bash
ssh nautilus
cd /home/bruh/bratstvo-admin
docker compose --env-file .env.compose -f docker-compose.prod.yml ps
docker compose --env-file .env.compose -f docker-compose.prod.yml logs -f app
```

The stack has two containers:

- `app` runs nginx, PHP-FPM, Laravel's scheduler, and Nova.
- `cloudflared` is the only public ingress. The app has no published host port.

Cloudflare Access protects the hostname with email codes. Its `Bratstvo Nova Users` group is reconciled from Nova users when a user is created, changed, or deleted, and every five minutes as a retry mechanism.

### Deployment configuration

Copy `.env.compose.example` to `.env.compose` and select the locally loaded app image and a reviewed, digest-pinned cloudflared image. Always pass `--env-file .env.compose` to production Compose commands: the service's `env_file` does not supply Compose's `${...}` interpolation.

Laravel configuration and credentials go in `.env.production` (based on `.env.production.example`), and the tunnel token goes in `.cloudflared.env` (based on `.cloudflared.env.example`). Restrict these files to mode `0600`.

### Deploy an update

Build the image from the current `admin/` source on Nautilus. The Nova Composer credential is passed as a BuildKit secret, never as an image build argument or committed file.

```bash
# From the repository's admin/ directory, copy the current source to Nautilus.
tar --exclude-vcs --exclude=node_modules --exclude=vendor \
  --exclude=.env --exclude='.env.*' --exclude=.cloudflared.env --exclude=auth.json -cf - . |
  ssh nautilus 'rm -rf /home/bruh/bratstvo-admin/build-src && \
  mkdir -p /home/bruh/bratstvo-admin/build-src && \
  tar -C /home/bruh/bratstvo-admin/build-src -xf -'

# On Nautilus, create a temporary Composer-auth file with mode 0600, then:
cd /home/bruh/bratstvo-admin/build-src
DOCKER_BUILDKIT=1 docker build --network=host \
  --secret id=composer_auth,src=/path/to/composer-auth.json \
  -t bratstvousa-admin:release-YYYYMMDD \
  -f docker/Dockerfile .
rm -f /path/to/composer-auth.json

# Select the image and recreate only the Laravel service.
cd /home/bruh/bratstvo-admin
sed -i 's|^ADMIN_IMAGE=.*|ADMIN_IMAGE=bratstvousa-admin:release-YYYYMMDD|' .env.compose
docker compose --env-file .env.compose -f docker-compose.prod.yml up -d --no-deps --force-recreate --wait app
docker compose --env-file .env.compose -f docker-compose.prod.yml ps
docker compose --env-file .env.compose -f docker-compose.prod.yml exec -T app php artisan about --only=environment
```

`--network=host` is for the ephemeral build only: Docker's default build network cannot resolve Nautilus's local DNS stub. It does not affect the deployed containers.

Do not remove the `bratstvo-admin_plumbing-db` or `bratstvo-admin_storage` volumes; they contain the local persistent state. Roll back by selecting a previous verified image tag in `.env.compose` and recreating only `app`.

### Access and tunnel checks

```bash
cd /home/bruh/bratstvo-admin
docker compose --env-file .env.compose -f docker-compose.prod.yml ps
docker compose --env-file .env.compose -f docker-compose.prod.yml logs --tail=100 cloudflared
docker compose --env-file .env.compose -f docker-compose.prod.yml exec -T app php artisan cloudflare-access:reconcile
```

Production secrets remain in `.env.production` and `.cloudflared.env`, both mode `0600`. Do not commit them. The tunnel's Cloudflare route is `admin.bratstvousa.com -> http://app:8080`.

The `bratstvo-admin-firewall` systemd service restricts app and tunnel egress. Review `deploy/nautilus-firewall.sh` before changing the Compose subnets.

Install the firewall after the Compose networks exist:

```bash
sudo install -m 0755 deploy/nautilus-firewall.sh /usr/local/sbin/bratstvo-admin-firewall
sudo install -m 0644 deploy/nautilus-firewall.service /etc/systemd/system/bratstvo-admin-firewall.service
sudo systemctl daemon-reload
sudo systemctl enable --now bratstvo-admin-firewall.service
```

The script filters forwarded private-network traffic in `DOCKER-USER` and new container-to-host connections in `INPUT`. It preserves established replies and is reapplied when Docker restarts. Verify app-to-D1/R2/email connectivity, tunnel-to-app port 8080, and blocked host/LAN connections after installation.

## Local development

From the repository root:

```bash
docker compose build admin
docker compose up -d admin
docker compose exec admin php artisan test
```

For code formatting, run `./vendor/bin/pint`. The project requires PHP 8.4.27 or newer in the 8.4 release line.
