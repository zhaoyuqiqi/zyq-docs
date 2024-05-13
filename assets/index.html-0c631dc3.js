import{_ as s,p as n,q as a,a1 as e}from"./framework-5866ffd3.js";const i={},t=e(`<h1 id="github-中的-ci-cd" tabindex="-1"><a class="header-anchor" href="#github-中的-ci-cd" aria-hidden="true">#</a> github 中的 CI/CD</h1><h2 id="action" tabindex="-1"><a class="header-anchor" href="#action" aria-hidden="true">#</a> action</h2><ul><li>在 github 中通过配置 yml 文件来配置 github 的 action 执行流程</li><li>详情查看 github action 的文档[https://docs.github.com/zh/actions/quickstart]</li><li>我们可以借助该 action 来执行 shell 脚本来做到自动部署的能力</li></ul><h2 id="ssh" tabindex="-1"><a class="header-anchor" href="#ssh" aria-hidden="true">#</a> ssh</h2><ul><li>我们还可以在上述提到的 action 中使用 ssh 命令连接我们的服务器。</li><li>使用 ssh 在 github 连接服务器时需要注意，我们要先生成一个 ssh 的密钥对</li></ul><div class="language-sheel line-numbers-mode" data-ext="sheel"><pre class="language-sheel"><code># 生成key
ssh-keygen -t rsa -C &quot;github actions&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>其中<code>私钥</code>放在 github 中，处于安全性的考虑，使用 GitHub 的 Secrets。 在项目的 Settings-&gt;Secrets-&gt;Actions 增加私钥，我这边将服务器的 Host，Port，Username 都配置进去了，方便修改，如下：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">name</span><span class="token punctuation">:</span> Build and Deploy

<span class="token key atrule">on</span><span class="token punctuation">:</span>
  <span class="token key atrule">push</span><span class="token punctuation">:</span>
    <span class="token key atrule">branches</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> main <span class="token comment"># 或者是你想触发自动构建的分支</span>

<span class="token key atrule">jobs</span><span class="token punctuation">:</span>
  <span class="token key atrule">build-and-deploy</span><span class="token punctuation">:</span>
    <span class="token key atrule">runs-on</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">-</span>latest
    <span class="token key atrule">steps</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Checkout repository
        <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v2

      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Set up SSH and execute commands
        <span class="token key atrule">uses</span><span class="token punctuation">:</span> appleboy/ssh<span class="token punctuation">-</span>action@master
        <span class="token key atrule">with</span><span class="token punctuation">:</span>
          <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.SERVER_IP <span class="token punctuation">}</span><span class="token punctuation">}</span>
          <span class="token key atrule">port</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.SERVER_PORT <span class="token punctuation">}</span><span class="token punctuation">}</span>
          <span class="token key atrule">username</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.SERVER_USER <span class="token punctuation">}</span><span class="token punctuation">}</span>
          <span class="token key atrule">key</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.SERVER_SSH_PRIVATE_KEY <span class="token punctuation">}</span><span class="token punctuation">}</span>
          <span class="token key atrule">script</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
            cd ~/app &amp;&amp; rm -rf xxxxx \\
            &amp;&amp; git clone xxxxx \\
            &amp;&amp; cd ./xxxxx &amp;&amp; source ~/.nvm/nvm.sh &amp;&amp; nvm use 18 &amp;&amp; pnpm i \\
            &amp;&amp; cd ../ &amp;&amp; pm2 start econsystem.config.js</span>
        <span class="token comment"># run: |</span><span class="token scalar string">
        #   mkdir -p ~/.ssh/
        #   echo &quot;\${{ secrets.SERVER_SSH_PRIVATE_KEY }}&quot; &gt; ~/.ssh/id_rsa
        #   chmod 600 ~/.ssh/id_rsa
        #   ssh-keyscan -H \${{ secrets.SERVER_IP }} &gt;&gt; ~/.ssh/known_hosts
        # env:
        #   SERVER_SSH_PRIVATE_KEY: \${{ secrets.SERVER_SSH_PRIVATE_KEY }}  # 之前在 Secrets 中设置的私钥
        #   SERVER_IP: \${{ secrets.SERVER_IP }}  # 你的服务器 IP</span>

      <span class="token comment"># - name: Build and deploy Docker image</span>
      <span class="token comment">#   run: |</span><span class="token scalar string">
      #     ssh -i ~/.ssh/id_rsa \${{ secrets.SERVER_USER }}@\${{ secrets.SERVER_IP }} &quot;
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
      #     &quot;
      #   env:
      #     SERVER_USER: \${{ secrets.SERVER_USER }}  # 你的服务器用户名</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>上述我们使用了<code>appleboy/ssh-action@master</code>来进行 ssh 连接，<code>host</code>、<code>port</code>、<code>username</code>、<code>key</code>分别对应主机地址（域名/ip）、主机端口号（如果是 22 可以省略）、用户名（服务器的登录用户名）、私钥，<code>script</code>表示连接到我们的服务器后执行的 sheel 脚本命令，可以看到我们先删除了 xxxxx 文件夹，又去拉取了我们的仓库，当然该位置使用<code>git pull</code>也是可以的，如果是私有仓库则需要对应的权限，比如设置 ssh 的免密登录 key，这部分就跟我们上述的登录正好相反了。</li><li>后续的脚本命令相信都能看明白，在此不做赘述。</li></ul>`,9),c=[t];function l(p,u){return n(),a("div",null,c)}const d=s(i,[["render",l],["__file","index.html.vue"]]);export{d as default};
