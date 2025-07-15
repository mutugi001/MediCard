FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    git \
    nano \
    curl \
    wget \
    unzip \
    lsb-release \
    gnupg2 \
    ca-certificates \
    apt-transport-https \
    software-properties-common

RUN add-apt-repository ppa:ondrej/php
RUN apt install php8.2 -y
RUN apt install php8.2-bcmath php8.2-fpm php8.2-xml php8.2-mysql \
    php8.2-zip php8.2-intl php8.2-ldap php8.2-gd \
    php8.2-cli php8.2-bz2 php8.2-curl php8.2-mbstring \
    php8.2-pgsql php8.2-opcache php8.2-soap php8.2-cgi -y

RUN curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
RUN php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer
RUN chmod +x /usr/local/bin/composer
RUN rm /tmp/composer-setup.php

WORKDIR /app

COPY . .
RUN chmod +x entrypoint.sh


RUN ls -la

RUN composer install
# RUN composer dump-autoload
ENV APP_KEY=base64:/Y0UAZit9Qq8rqfecq1tdO5ZmxRzCwh0aIIZeWiSwQA=

RUN php artisan key:generate

EXPOSE 8000

# COPY entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

