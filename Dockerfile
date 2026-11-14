
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
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN mkdir -p bootstrap/cache storage/framework/cache storage/framework/sessions storage/framework/views storage/logs

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

RUN sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
    && printf '<Directory /var/www/html/public>\nAllowOverride All\nRequire all granted\n</Directory>\n' > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

RUN chown -R www-data:www-data storage bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 10000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
