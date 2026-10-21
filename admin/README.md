<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Production operations

The live admin is at `https://admin.bratstvousa.com`, hosted on `23.92.25.92`.
With the deployment key configured
in `~/.ssh/config`, connect using:

```bash
ssh bratstvo-admin-prod
```

SSH configuration (the private key stays on your workstation):

```sshconfig
Host bratstvo-admin-prod
    HostName 23.92.25.92
    User root
    IdentityFile ~/.ssh/id_ed25519_bratstvo_admin
    IdentitiesOnly yes
```

If the public key needs installing, use an existing authorized login:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519_bratstvo_admin.pub root@23.92.25.92
```

The live Compose stack is in `/root/admin/docker-compose.prod.yml`. It runs
`bratstvousa-admin:amd64` with `pull_policy: never` and a Cloudflare Tunnel sidecar.
Images are transferred with `docker save | ssh bratstvo-admin-prod docker load`.
Keep the live Compose file and its external database/storage volumes intact.
The repository's Compose file instead defaults to a GHCR image.

After loading a verified image and tagging it `bratstvousa-admin:amd64`, deploy
and verify it from this directory:

```bash
ssh bratstvo-admin-prod 'docker compose --project-directory /root/admin -f /root/admin/docker-compose.prod.yml up -d --no-deps --force-recreate --wait app'
ssh bratstvo-admin-prod 'docker compose --project-directory /root/admin -f /root/admin/docker-compose.prod.yml exec -T app php -v'
ssh bratstvo-admin-prod 'docker compose --project-directory /root/admin -f /root/admin/docker-compose.prod.yml exec -T app php-fpm -v'
```

PHP must be **8.4.27 or newer in the 8.4 branch** to include the fixes for
CVE-2026-109618 and CVE-2026-109619. Rebuild production images with `--pull`;
restart containers to replace all workers. Native session upload tracking is
disabled at startup as additional hardening. Updating Composer packages alone
does not patch PHP.

On 2026-10-21, production was rebuilt on the host using PHP 8.4.27 and the
existing deployed application files. The build context is retained at
`/root/admin/php-security-20261021`, and the resulting image is tagged
`bratstvousa-admin:php-8.4.27-security-20261021` (also `:amd64`). The previous
image is retained as `bratstvousa-admin:pre-php-security-20261021`; it contains
vulnerable PHP and is only an emergency rollback artifact. A consistent SQLite
backup is in the database volume as `plumbing.pre-php-security-20261021.sqlite`.

Development also uses the official PHP 8.4.27 image so it does not depend on
third-party PHP package release timing. Use container PHP for project commands;
the workstation's NixOS-managed PHP is updated separately through its system
configuration.

For the active Sail development image, run from the repository root:

```bash
docker compose build --pull --no-cache admin
docker compose up -d --no-deps --force-recreate admin
docker compose exec admin php -v
```

To run a PHP command without starting the development web server or database:

```bash
docker compose run --rm --no-deps admin php artisan test
```

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[WebReinvent](https://webreinvent.com/)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Jump24](https://jump24.co.uk)**
- **[Redberry](https://redberry.international/laravel/)**
- **[Active Logic](https://activelogic.com)**
- **[byte5](https://byte5.de)**
- **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
