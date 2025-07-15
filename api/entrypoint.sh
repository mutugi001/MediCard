#!/bin/bash

# Check if the database is ready
until php artisan migrate --force; do
  echo "Waiting for database to be ready..."
  sleep 2
done

# Ensure APP_KEY is set
if ! grep -q "^APP_KEY=" .env || [ -z "$(grep "^APP_KEY=" .env | cut -d '=' -f2)" ]; then
  echo "Generating new APP_KEY..."
  php artisan key:generate
else
  echo "APP_KEY already set."
fi

php artisan cache:clear
php artisan config:cache
php artisan route:clear
php artisan view:clear

# php artisan storage:link

exec php artisan serve --host=0.0.0.0 --port=8000
