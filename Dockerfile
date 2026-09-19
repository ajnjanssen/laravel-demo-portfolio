FROM php:8.3-cli

WORKDIR /var/www/html

# Install PHP dependencies and Composer
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	libonig-dev \
	libzip-dev \
	libicu-dev \
	curl \
	gnupg \
	git \
	unzip \
	&& curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
	&& curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
	&& apt-get install -y nodejs \
	&& docker-php-ext-install -j"$(nproc)" mbstring pdo_mysql zip intl \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

COPY . .
RUN composer install \
	--no-interaction \
	--no-progress \
	--prefer-dist \
	--optimize-autoloader \
	--no-scripts

RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views \
	storage/logs bootstrap/cache \
	&& chown -R www-data:www-data storage bootstrap/cache \
	&& chmod -R ug+rwX storage bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint && chmod +x /usr/local/bin/entrypoint

# 8000 voor Laravel, 5173 voor Vite dev server
EXPOSE 8000 5173

ENTRYPOINT ["entrypoint"]
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]