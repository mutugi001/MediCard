FROM php:8.4-cli

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_ENV=production \
    APP_DEBUG=false

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    unzip \
    libicu-dev \
    libzip-dev \
    libxml2-dev \
    libonig-dev \
    libcurl4-openssl-dev \
    && docker-php-ext-install bcmath intl mbstring pdo_mysql zip opcache xml curl \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader

COPY . .

RUN chmod +x entrypoint.sh \
    && mkdir -p storage/logs bootstrap/cache \
    && chown -R www-data:www-data /app

EXPOSE 10000

ENTRYPOINT ["./entrypoint.sh"]

