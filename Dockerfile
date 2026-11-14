
FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libsqlite3-dev \
    libonig-dev \
    libcurl4-openssl-dev \
    unzip \
    && docker-php-ext-install \
        pdo_pgsql \
        pdo_sqlite \
        bcmath \
        intl \
        zip \
        opcache \
        mbstring \
        curl \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN mkdir -p \
    bootstrap/cache \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

RUN sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
    && printf '<Directory /var/www/html/public>\nAllowOverride All\nRequire all granted\n</Directory>\n' > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

RUN printf '%s\n' \
    'Header onsuccess unset Access-Control-Allow-Origin' \
    'Header always unset Access-Control-Allow-Origin' \
    'Header always set Access-Control-Allow-Origin "https://mont-djurdjura.vercel.app"' \
    'Header always set Access-Control-Allow-Credentials "true"' \
    'Header always set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS"' \
    'Header always set Access-Control-Allow-Headers "Accept, Content-Type, X-XSRF-TOKEN, X-Requested-With, Authorization"' \
    'Header always merge Vary "Origin"' \
    > /etc/apache2/conf-available/cors.conf \
    && a2enconf cors

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000

CMD ["sh", "-c", "set -e; PORT=${PORT:-10000}; php artisan migrate --force -vvv; sed -i \"s/Listen 80/Listen ${PORT}/\" /etc/apache2/ports.conf; sed -i \"s/:80>/:${PORT}>/\" /etc/apache2/sites-available/000-default.conf; chown -R www-data:www-data storage bootstrap/cache; exec apache2-foreground"]
