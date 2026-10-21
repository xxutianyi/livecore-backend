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

FROM php:8.4.27-cli-bookworm AS runtime

WORKDIR /var/www/html

ENV TZ=UTC

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 使用 PHP 官方修复镜像，不依赖临时不可用的 Ondřej PPA。
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates curl dnsutils ffmpeg fswatch git gnupg gosu \
        libcap2-bin libc-client-dev libfreetype6-dev libicu-dev libjpeg62-turbo-dev \
        libkrb5-dev libldap2-dev libmagickwand-dev libmemcached-dev libonig-dev \
        libpng-dev libpq-dev libsasl2-dev libsqlite3-dev libssl-dev libwebp-dev \
        libxml2-dev libxslt1-dev libzip-dev nano postgresql-client python3 \
        sqlite3 supervisor unzip zip zlib1g-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-configure imap --with-kerberos --with-imap-ssl \
    && docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath gd imap intl ldap mbstring mysqli opcache pcntl pdo_mysql \
        pdo_pgsql pdo_sqlite pgsql soap sockets xsl zip \
    && pecl install igbinary msgpack redis mongodb swoole memcached imagick pcov xdebug \
    && docker-php-ext-enable igbinary msgpack redis mongodb swoole memcached imagick pcov xdebug \
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
