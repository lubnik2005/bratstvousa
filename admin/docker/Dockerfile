# syntax=docker/dockerfile:1.7

############################
# Stage 1: composer deps
############################
FROM php:8.4-cli-bookworm AS vendor

# System deps for composer + native ext builds
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
        libonig-dev libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" gd zip bcmath exif pcntl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# COMPOSER_AUTH is injected at build time (Nova private repo download key).
ARG COMPOSER_AUTH

# Copy composer manifests + the vendored l1 path package first for layer caching.
COPY composer.json composer.lock ./
COPY packages ./packages

# Install prod deps without running scripts (artisan not yet present / no app code).
RUN --mount=type=cache,target=/tmp/composer-cache \
    COMPOSER_CACHE_DIR=/tmp/composer-cache \
    composer install \
        --no-dev \
        --no-interaction \
        --no-progress \
        --prefer-dist \
        --no-scripts \
        --optimize-autoloader

# Cache-bust knob: pass --build-arg CACHEBUST=$(date +%s) to force a fresh
# COPY of application source (and thus a new image digest) when file-checksum
# caching would otherwise dedup to a prior build.
ARG CACHEBUST=0
RUN echo "cachebust=${CACHEBUST}" > /tmp/cachebust
# Now copy the full application source and finalize autoloader + discovery.
COPY . .

RUN --mount=type=cache,target=/tmp/composer-cache \
    COMPOSER_CACHE_DIR=/tmp/composer-cache \
    composer dump-autoload --optimize --no-dev \
    && composer run-script post-autoload-dump || true

############################
# Stage 2: front-end assets
############################
FROM node:22-bookworm-slim AS assets

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Vite config + sources needed to build the (minimal) app manifest.
COPY vite.config.js postcss.config.js tailwind.config.js ./
COPY resources ./resources
COPY public ./public

RUN npm run build

############################
# Stage 3: runtime (php-fpm + nginx via supervisor)
############################
FROM php:8.4-fpm-bookworm AS runtime

ENV DEBIAN_FRONTEND=noninteractive \
    TZ=UTC

RUN apt-get update && apt-get install -y --no-install-recommends \
        nginx supervisor gosu sqlite3 curl \
        libzip-dev libpng-dev libjpeg-dev libfreetype6-dev libonig-dev libxml2-dev \
        ca-certificates \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" gd zip bcmath exif pcntl opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /var/www/html

# App code + vendored deps from the vendor stage.
COPY --from=vendor /app /var/www/html
# Built front-end assets (public/build) from the assets stage.
COPY --from=assets /app/public/build /var/www/html/public/build

# Container config
COPY docker/php/php.ini /usr/local/etc/php/conf.d/99-app.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/10-opcache.ini
COPY docker/php-fpm/www.conf /usr/local/etc/php-fpm.d/zz-www.conf
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh \
    && rm -f /etc/nginx/sites-enabled/default \
    # www-data owns the app for fpm + writable dirs
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
