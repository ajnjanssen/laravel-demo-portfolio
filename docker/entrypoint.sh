#!/bin/sh
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

find bootstrap/cache -type f -delete 2>/dev/null || true
find storage/framework/cache -type f -delete 2>/dev/null || true
find storage/framework/views -type f -delete 2>/dev/null || true
find storage/framework/sessions -type f -delete 2>/dev/null || true

if ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force
fi

php artisan config:clear
php artisan package:discover --ansi || true

if [ ! -L public/storage ]; then
    php artisan storage:link
fi

php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder --force

exec "$@"