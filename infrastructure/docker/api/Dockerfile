FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    libzip-dev \
    oniguruma-dev \
    libxml2-dev \
    && docker-php-ext-install -j$(nproc) \
    bcmath \
    mbstring \
    pdo_mysql \
    xml \
    zip \
    opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY hris-api/ ./

RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    && chown -R www-data:www-data storage bootstrap/cache

CMD ["php-fpm"]