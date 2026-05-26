# === 第一阶段：编译前端资源 ===
FROM node:24.13.0-slim AS node-builder
WORKDIR /app

# 复制前端配置文件并安装依赖
COPY package*.json ./
RUN npm install

# 复制所有项目文件并编译前端资源
COPY . .
RUN npm run build

# === 第二阶段：打包二进制包 ===
FROM --platform=linux/amd64 dunglas/frankenphp:static-builder-musl AS static-builder

# 复制项目文件
WORKDIR /go/src/app/dist/app
COPY . .

# 安装依赖
RUN composer install --ignore-platform-reqs --no-dev -a

# 复制前端资源
COPY --from=node-builder /app/public/build ./public/build

# 构建静态二进制文件
WORKDIR /go/src/app
RUN EMBED=dist/app/ ./build-static.sh

# === 第三阶段：配置运行环境 ===
FROM --platform=linux/amd64 alpine:latest AS runtime

RUN apk add --no-cache \
    supervisor \
    bash \
    curl \
    postgresql-client

WORKDIR /app

COPY --from=static-builder /go/src/app/dist/frankenphp-linux-x86_64 /usr/local/bin/frankenphp

# 权限设置
RUN chmod +x /usr/local/bin/frankenphp && \
    chown -R www-data:www-data storage bootstrap/cache

# Supervisor 配置
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 8000 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/up || exit 1

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
