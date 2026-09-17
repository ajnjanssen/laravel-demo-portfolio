#!/bin/sh
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force
fi

php artisan config:clear

if [ ! -L public/storage ]; then
    php artisan storage:link
fi

php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder --force

exec "$@"