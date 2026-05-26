# === 第一阶段：编译前端资源 ===
FROM node:24.13.0-slim AS node-builder
WORKDIR /app

# 复制前端配置文件并安装依赖
COPY package*.json ./
RUN npm install

# 复制所有项目文件并编译前端资源
COPY . .
RUN npm run build

# === 第二阶段：配置运行环境 ===
FROM dunglas/frankenphp:1.12.3-php8.4 AS runtime

# 安装系统依赖
RUN apt-get update && apt-get upgrade -y && apt-get install -y supervisor

# 安装 php 依赖
RUN install-php-extensions pcntl pdo_pgsql pdo_mysql

WORKDIR /app

# 复制项目文件并安装依赖
COPY . .
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 复制前端资源
COPY --from=node-builder /app/public/build ./public/build

# 目录授权写入
RUN chown -R www-data:www-data storage bootstrap/cache

# Supervisor 配置
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 8000 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/up || exit 1

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
