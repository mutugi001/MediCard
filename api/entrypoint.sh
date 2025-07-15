#!/bin/bash

# Check if the database is ready
until php artisan migrate --force; do
  echo "Waiting for database to be ready..."
  sleep 2
done

php artisan cache:clear
php artisan config:cache
php artisan route:clear
php artisan view:clear

# php artisan storage:link

exec php artisan serve --host=0.0.0.0 --port=8000
