# 使用官方 Node.js 镜像作为基础镜像
FROM node:20-alpine AS build-stage

# 设置工作目录
WORKDIR /app

RUN corepack enable

# 复制 package.json 和 pnpm-lock.yaml（如果有）
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm install --force

# 复制整个项目
COPY . .

# 构建项目
RUN pnpm build

# 暴露端口（根据你的应用）
EXPOSE 3200

# 启动应用
CMD ["node", "dist/index.js"]