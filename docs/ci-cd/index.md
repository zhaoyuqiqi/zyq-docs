# github 中的 CI/CD

## action

- 在 github 中通过配置 yml 文件来配置 github 的 action 执行流程
- 详情查看 github action 的文档[https://docs.github.com/zh/actions/quickstart]
- 我们可以借助该 action 来执行 shell 脚本来做到自动部署的能力

## ssh

- 我们还可以在上述提到的 action 中使用 ssh 命令连接我们的服务器。
- 使用 ssh 在 github 连接服务器时需要注意，我们要先生成一个 ssh 的密钥对

```sheel
# 生成key
ssh-keygen -t rsa -C "github actions"
```

其中`私钥`放在 github 中，处于安全性的考虑，使用 GitHub 的 Secrets。 在项目的 Settings->Secrets->Actions 增加私钥，我这边将服务器的 Host，Port，Username 都配置进去了，方便修改，如下：

```yml
name: Build and Deploy

on:
  push:
    branches:
      - main # 或者是你想触发自动构建的分支

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up SSH and execute commands
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          port: ${{ secrets.SERVER_PORT }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_PRIVATE_KEY }}
          script: |
            cd ~/app && rm -rf xxxxx \
            && git clone xxxxx \
            && cd ./xxxxx && source ~/.nvm/nvm.sh && nvm use 18 && pnpm i \
            && cd ../ && pm2 start econsystem.config.js
        # run: |
        #   mkdir -p ~/.ssh/
        #   echo "${{ secrets.SERVER_SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
        #   chmod 600 ~/.ssh/id_rsa
        #   ssh-keyscan -H ${{ secrets.SERVER_IP }} >> ~/.ssh/known_hosts
        # env:
        #   SERVER_SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_PRIVATE_KEY }}  # 之前在 Secrets 中设置的私钥
        #   SERVER_IP: ${{ secrets.SERVER_IP }}  # 你的服务器 IP

      # - name: Build and deploy Docker image
      #   run: |
      #     ssh -i ~/.ssh/id_rsa ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_IP }} "
      #       cd ~/app
      #       rm -rf musicQ-server
      #       git clone https://github.com/zhaoyuqiqi/musicQ-server.git
      #       nvm use 16
      #       pnpm i
      #       ts-node src/app.ts
      #       # docker build -t music7 .
      #       # docker stop music7 || true
      #       # docker rm music7 || true
      #       # docker run -d --name music7 music7
      #     "
      #   env:
      #     SERVER_USER: ${{ secrets.SERVER_USER }}  # 你的服务器用户名
```

- 上述我们使用了`appleboy/ssh-action@master`来进行 ssh 连接，`host`、`port`、`username`、`key`分别对应主机地址（域名/ip）、主机端口号（如果是 22 可以省略）、用户名（服务器的登录用户名）、私钥，`script`表示连接到我们的服务器后执行的 sheel 脚本命令，可以看到我们先删除了 xxxxx 文件夹，又去拉取了我们的仓库，当然该位置使用`git pull`也是可以的，如果是私有仓库则需要对应的权限，比如设置 ssh 的免密登录 key，这部分就跟我们上述的登录正好相反了。
- 后续的脚本命令相信都能看明白，在此不做赘述。
