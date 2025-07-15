#!/bin/bash

#check if mysql is up
while ! mysqladmin ping -h "localhost" --silent; do
    echo "Waiting for MySQL to be available..."
    sleep 1
done
