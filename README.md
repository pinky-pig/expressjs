express 服务

0. 打包
   打包 Docker 镜像

1. 压缩

```bash
docker save expressjs:latest -o expressjs.tar
```

2. 先将服务器的 docker 服务停掉

远程登录上去

```bash
ssh root@47.116.xx.xxx
```

按回车后输入 yes ，再按回车后输入密码登录

```bash
# 查看 docker 状态
systemctl status docker
# 关闭
systemctl stop docker
```

3. 发送

通过 FileZilla 发送到 /usr/share/workspace 目录下

4. 检查镜像：

```bash
docker images
docker rmi <images_id>
docker images
```

5. 加载镜像：

```bash
# 加载
docker load -i /usr/share/workspace/expressjs.tar
# 查看是否加载上去
docker images
```

6. 运行容器：

```bash
docker run --rm -d -p 3200:3200 expressjs:latest
```

7. 查看运行状态：

```bash
docker ps
```
