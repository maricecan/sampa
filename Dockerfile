FROM php:7.1.12-apache-jessie

RUN pecl install -o -f redis \
&&  rm -rf /tmp/pear \
&&  docker-php-ext-enable redis

COPY ./src /var/www/html
COPY ./assets /var/www/html/assets
