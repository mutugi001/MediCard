#!/bin/bash

echo "PORT=$PORT"

php artisan optimize:clear

php artisan config:cache

php artisan route:cache || true

php artisan storage:link || true

exec php artisan serve --host=0.0.0.0 --port="${PORT}"
