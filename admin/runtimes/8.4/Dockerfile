FROM node:22-bookworm-slim AS node
FROM php:8.4.27-cli-bookworm

ARG WWWGROUP
ARG MYSQL_CLIENT="default-mysql-client"
ARG POSTGRES_VERSION=17

WORKDIR /var/www/html

ENV DEBIAN_FRONTEND=noninteractive \
    TZ=UTC \
    SUPERVISOR_PHP_COMMAND="/usr/local/bin/php -d variables_order=EGPCS /var/www/html/artisan serve --host=0.0.0.0 --port=80" \
    SUPERVISOR_PHP_USER="sail"

# Use patched upstream PHP rather than waiting for third-party package builds.
RUN php -r 'exit(PHP_VERSION_ID >= 80427 && PHP_VERSION_ID < 80500 ? 0 : 1);'

RUN apt-get update && apt-get install -y --no-install-recommends \
        gnupg gosu curl ca-certificates zip unzip git supervisor sqlite3 libcap2-bin \
        python3 dnsutils librsvg2-bin fswatch ffmpeg nano \
        libpng-dev libjpeg-dev libfreetype6-dev libzip-dev libicu-dev \
        libpq-dev libxml2-dev libldap2-dev libmemcached-dev libsasl2-dev \
        libmagickwand-dev libc-client2007e-dev libkrb5-dev libssl-dev \
        jpegoptim optipng pngquant gifsicle libavif-bin \
        "$MYSQL_CLIENT" \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        gd zip bcmath soap intl pcntl exif opcache pdo_mysql pdo_pgsql pgsql ldap sockets \
    && MAKEFLAGS="-j$(nproc)" pecl install igbinary msgpack redis memcached imagick mongodb xdebug pcov imap \
    && docker-php-ext-enable igbinary msgpack redis memcached imagick mongodb pcov imap \
    && docker-php-ext-enable --ini-name 20-xdebug.ini xdebug \
    && rm -rf /tmp/pear

RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL --retry 5 --retry-all-errors \
        https://www.postgresql.org/media/keys/ACCC4CF8.asc -o /tmp/pgdg.asc \
    && gpg --dearmor -o /etc/apt/keyrings/pgdg.gpg /tmp/pgdg.asc \
    && rm /tmp/pgdg.asc \
    && echo "deb [signed-by=/etc/apt/keyrings/pgdg.gpg] https://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" \
        > /etc/apt/sources.list.d/pgdg.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client-$POSTGRES_VERSION \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/pear

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
    && npm install -g npm pnpm bun svgo yarn \
    && ln -s /usr/local/bin/php /usr/bin/php \
    && ln -s /usr/local/bin/php /usr/bin/php8.4 \
    && setcap "cap_net_bind_service=+ep" /usr/local/bin/php \
    && groupadd --force -g $WWWGROUP sail \
    && useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u 1337 sail

COPY start-container /usr/local/bin/start-container
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY php.ini /usr/local/etc/php/conf.d/99-sail.ini
RUN chmod +x /usr/local/bin/start-container

EXPOSE 80/tcp

ENTRYPOINT ["start-container"]
