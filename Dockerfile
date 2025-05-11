# 使用 Node.js 最新版作为构建环境
FROM node:20 AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖（推荐使用 npm ci 替代 npm install，确保依赖版本一致）
RUN npm ci --legacy-peer-deps

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build

# 使用 Nginx 作为生产服务器
FROM nginx:latest

# 复制构建产物到 Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]