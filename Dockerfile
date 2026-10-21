# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================

FROM node:24.13.0-slim AS dependencies

# Set working directory
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Install project dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/usr/local/share/.cache/yarn \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
  if [ -f package-lock.json ]; then \
    npm ci --no-audit --no-fund; \
  elif [ -f yarn.lock ]; then \
    corepack enable yarn && yarn install --frozen-lockfile --production=false; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm install --frozen-lockfile; \
  else \
    echo "No lockfile found." && exit 1; \
  fi

# ============================================
# Stage 2: Run application
# ============================================

FROM ubuntu:24.04 AS runtime

WORKDIR /var/www/html

ENV DEBIAN_FRONTEND=noninteractive \
    TZ=UTC

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 使用 PHP 官方源码构建修复版本，不依赖尚未更新的二进制包源。
RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends \
        autoconf bison build-essential ca-certificates curl dnsutils ffmpeg fswatch git gnupg gosu \
        libargon2-dev libcap2-bin libc-client2007e-dev libcurl4-openssl-dev libedit-dev libffi-dev libfreetype6-dev libgettextpo-dev libicu-dev libjpeg-dev \
        libkrb5-dev libldap2-dev libmagickwand-dev libmemcached-dev libonig-dev \
        libpng-dev libpq-dev libreadline-dev libsasl2-dev libsqlite3-dev libssl-dev libwebp-dev \
        libsodium-dev libxml2-dev libxslt1-dev libzip-dev nano pkg-config postgresql-client python3 re2c \
        sqlite3 supervisor unzip zip zlib1g-dev \
    && curl -fsSL https://www.php.net/distributions/php-8.4.27.tar.xz -o /tmp/php.tar.xz \
    && mkdir -p /usr/src/php \
    && tar -xJf /tmp/php.tar.xz -C /usr/src/php --strip-components=1 \
    && cd /usr/src/php \
    && ./configure \
        --prefix=/usr/local \
        --with-config-file-path=/usr/local/etc \
        --with-config-file-scan-dir=/usr/local/etc/php/conf.d \
        --with-pear \
        --enable-bcmath --enable-calendar --enable-exif --enable-ffi --enable-ftp --enable-intl --enable-mbstring \
        --enable-opcache --enable-pcntl --enable-shmop --enable-soap --enable-sockets --enable-sysvmsg \
        --enable-sysvsem --enable-sysvshm --with-curl --with-freetype --with-gd --with-jpeg --with-webp \
        --with-gettext --with-kerberos --with-ldap --with-ldap-sasl --with-libdir="lib/$(gcc -print-multiarch)" --with-mysqli=mysqlnd \
        --with-openssl --with-password-argon2 --with-pdo-mysql=mysqlnd --with-pdo-pgsql --with-pdo-sqlite \
        --with-pgsql --with-readline --with-sodium=shared --with-xsl --with-zip \
    && make -j"$(nproc)" \
    && make install \
    && mkdir -p /usr/local/etc/php/conf.d \
    && touch /usr/local/etc/php/php.ini \
    && install_php_extension() { \
        extension_repo="$1"; extension_tag="$2"; shift 2; \
        extension_dir="$(mktemp -d)"; \
        curl -fsSL --retry 5 --retry-all-errors --retry-delay 2 "https://github.com/${extension_repo}/archive/refs/tags/${extension_tag}.tar.gz" -o /tmp/extension.tar.gz; \
        tar -xzf /tmp/extension.tar.gz -C "$extension_dir" --strip-components=1; \
        (cd "$extension_dir" && phpize && ./configure "$@" && make -j"$(nproc)" && make install); \
        rm -rf "$extension_dir" /tmp/extension.tar.gz; \
    } \
    && install_php_extension igbinary/igbinary 3.2.16 \
    && install_php_extension msgpack/msgpack-php msgpack-3.0.0 \
    && install_php_extension phpredis/phpredis 6.3.0 \
    && install_php_extension mongodb/mongo-php-driver 2.5.3 \
    && install_php_extension swoole/swoole-src v6.2.3 \
    && install_php_extension php-memcached-dev/php-memcached v3.4.0 \
    && install_php_extension Imagick/imagick 3.8.1 \
    && install_php_extension php/pecl-mail-imap 1.0.3 \
    && printf '%s\n' \
        'extension=igbinary' 'extension=msgpack' 'extension=redis' 'extension=mongodb' \
        'extension=swoole' 'extension=memcached' 'extension=imagick' 'extension=imap' \
        > /usr/local/etc/php/conf.d/50-extensions.ini \
    && rm -rf /usr/src/php /tmp/php.tar.xz \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_24.x nodistro main" > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g npm pnpm bun corepack \
    && corepack enable \
    && corepack prepare yarn@stable --activate \
    && npx -y playwright install-deps \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# The Octane, Reverb, and queue processes all use the PHP CLI SAPI.
COPY docker/php.ini /usr/local/etc/php/conf.d/99-livecore-security.ini

RUN php -r 'if (version_compare(PHP_VERSION, "8.4.27", "<")) { fwrite(STDERR, "PHP 8.4.27 or newer is required; found ".PHP_VERSION."\\n"); exit(1); }'

# 复制项目文件并安装依赖
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload

# 复制前端依赖供运行时打包
COPY --from=dependencies /app/node_modules ./node_modules

# 复制运行脚本
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/start-container /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container

EXPOSE 8000 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/up || exit 1

ENTRYPOINT ["start-container"]
