#!/bin/sh
set -e

cd /var/www/html

if [ ! -f .env ]; then
    cp .env.example .env
fi

find bootstrap/cache -type f -delete 2>/dev/null || true
find storage/framework/cache -type f -delete 2>/dev/null || true
find storage/framework/views -type f -delete 2>/dev/null || true
find storage/framework/sessions -type f -delete 2>/dev/null || true

if [ -f package.json ]; then
    npm install --include=optional --no-fund --no-audit >/tmp/npm-install.log 2>&1 || { cat /tmp/npm-install.log; exit 1; }
    npm run dev -- --host 0.0.0.0 --port 5173 >/tmp/vite.log 2>&1 &
fi

if ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force
fi

php artisan config:clear
php artisan package:discover --ansi || true

if [ ! -L public/storage ]; then
    php artisan storage:link
fi

php artisan vendor:publish --tag=livewire:assets --force || true
php artisan vendor:publish --tag=filament-assets --force || true

php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder --force

exec "$@"