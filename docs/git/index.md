---
title: git
---

# 前言

之前也工作了一段时间，但是对于 git 的使用基本上停留在 pull、add 、commit、push 上，也没有进行基本的整理，有一次某大厂同事让我复制他的一个 commit 到我的分支，我实在不知道怎么复制，也愣头青不好意思问，就把那个分支自己一点一点的改动复制过来，他看到我的操作后吃惊的表情我到现在还记得，整理一下大厂常用的 git 高级命令（`git cherry-pick`、`git revert`、`git rebase`、`git branch`、`git checkout`、`git stash`），以后妈妈再也不用担心我被同事嘲笑不会 git 了。

## 一、git clone 克隆远端仓库到本地

- 不指定分支克隆

```ts
git clone 仓库地址
```

- 指定分支克隆

```ts
git clone -b 分支名 仓库地址
```

## 二、git fetch 拉取仓库最新分支信息

```ts
git fetch origin
```

## 三、git log 查看当前分支提交日志

```ts
git log
```

## 四、git add 将本地的 changes 进行暂存，暂存后可为后续提交做准备

- 将单个文件放置到暂存区
  ```ts
  git add 文件名
  ```
- 将所有 changes 放置到暂存区
  ```ts
  git add .
  ```

## 五、git commit 将暂存区文件提交至本地仓库

- 该命令之后对加入暂存区的文件生效，即通过`git add `命令后的文件才会被提交至本地仓库
- 如果只想提交暂存区中的某些文件，我们可以使用如下命令
  ```ts
  git commit  文件名 文件名
  ```
- 该命令可以填写一条提交信息 若只使用 `git  commit` 那么会将所有在暂存区的文件提交至本地仓库，且会进入 vim 的命令行进行提交信息的填写。
- 我们可以使用如下命令来进行编辑提交信息
  ```ts
  git commit -m "这是我本次的提交信息"
  ```
- 有人可能会觉得每次都需要使用`git add`之后才能使用`git commit`不方便，其实也为我们提供了简写方式如下：
  ```ts
  git  commit -a -m "这是我本次的提交信息"
  ```
  使用上述命令，我们可以直接对所有的 changes 进行提交，个人并不建议使用该命令，因为有些 changes 可能并不适合本次提交而是应该放到另一个 commit 中，我们可以针对本次需要提交的 changes 添加到暂存区然后再进行提交。

## 六、git pull 将远程仓库拉取到本地并合并

- 我们可以使用如下代码进行拉取

  ```ts
  git pull origin 远程分支名:要合并的本地分支名
  ```

- 一般来说我们的本地分支名跟远程分支名是相同的，因此我们可以将本地分支名跟远程分支名进行合并然后省略冒号如下：
  ```ts
  git pull origin 分支名
  ```

## 七、git push 将本地仓库推送至远程仓库并合并

- 该命令可以将我们本地的仓库推送至远程仓库供其他人拉取合并等操作
- 我们可以使用如下代码进行推送

  ```ts
  git push origin 本地分支名:远程分支名
  ```

- 一般来说我们的本地分支名跟远程分支名是相同的，因此我们可以将本地分支名跟远程分支名进行合并然后省略冒号如下：
  ```ts
  git push origin 分支名
  ```
- 如果本地分支跟远程分支有冲突是推送不上去的，我们可以使用如下命令来强制推送：

  ```ts
  git push --force origin 分支名
  ```

  简写

  ```ts
  git push -f origin 分支名
  ```

  **若多人共同开发一个分支，强制推送有可能覆盖他人代码，需慎用！！！**

## 八、git branch 处理分支相关操作

- 查看分支列表

  ```ts
  git branch -a
  ```

该命令可查看当前仓库下存在的分支名列表

- 创建分支

  ```ts
  git branch 分支名
  ```

- 删除分支（首先需要切到不是要删除的分支上去）

  - 删除本地分支

    - 删除本地未推到远程仓库的分支(强制删除本地分支)
      ```ts
      git branch -D 分支名
      ```
    - 删除本地已经推到远程仓库的分支

      ```ts
      git branch -d 分支名
      ```

  - 删除远程仓库分支
    - 完整语法
      ```ts
      git push origin --delete 分支名
      ```
    - 简写（使用 `:` 代替了 `--delete` 且没有空格）
      ```ts
      git push origin :分支名
      ```

## 九、git checkout 切换分支

- 首先本地先拉取到最新的分支 list 后可通过该命令切换分支
  ```ts
  git checkout 分支名
  ```
- 切换到新创建分支(该语法其实是先从当前分支新建分支然后切到该分支是`git branch 分支名` 与 `git checkout 分支名`的结合)

  ```ts
  git checkout -b 分支名
  ```

## 十、git cherry-pick 复制某个 commit 到该分支

- 有时候我们会有这样的诉求，跟同事在不同的分支开发，你们两个的需求都还没有开发完成不能合码，但是你需要他的已开发的一次 commit 的内容，我们不可能跟同事去重复开发一份，此时我们可以使用该命令。其中 commit 的 id 可以从我们的仓库提交中查看到，或是使用`git log`查看提交日志，里面的记录就有提交的 commit 的 id。

  ```ts
  git cherry-pick  需要复制过来的commit的id
  ```

  执行完这个命令后，同事的 commit 便会同步到你这个分支上，你便可以使用同事开发的功能了。

## 十一、git reset 回滚 commit

- 有时候我们在开发时，刚在提交了代码便发现刚才的提交有个明显 bug 或是刚才的提交漏了部分东西，我们当然可以再提交一个 commit 来修改发现的问题，但是如果这几次提交只是为了解决同一个问题，那么并不建议提交多个 commit，可以在本地回滚代码修改好了之后再次提交，命令如下：
  ```ts
  git reset 想要回滚到的commit的id
  ```
  修改完了之后重新提交即可。
  如果我们在本地开发还未推送至远程仓库，那么以上代码足矣。
- 已推送至远程仓库后，我们回滚后会发现无法 push 上去，原因是因为我们本地的分支通过回滚已经落后远程分支，此时我们可以使用`git push -f origin 分支名`强制推送。
- **永远记住只要涉及强制推送必须慎用。**

## 十二、git revert 以一次完全相反的 commit 提交来回滚某个 commit 提交

- 有时候我们提交了一个 commit，在此之后，同事又在你的提交之后提交了他的 commit，我们发现我们提交的 commit 有问题，或是产品说这个需求本次不跟车，那么我们的代码已经合进去了怎么办呢？我们此时可以使用该命令来提交一个与我们之前的 commit 完全相反的 commit 来抵消掉之前的提交。命令如下：

  ```ts
  git revert 需要撤回commit的id
  ```

- 有人可能会问`git reset`跟`git revert`有什么区别呢？我们要知道，**reset**意为重置，在之后的 commit 会全部进行丢弃也不会有任何提交记录，**revert**会使用一个 commit 来抵消之前的 commit，是有记录的，我们也不需要进行强制推送，以此来做到不发生更改的目的。

## 十三、git rebase 使用该命令来减少 commit

- 有一篇文章写的很好[点击这里学习](http://jartto.wang/2018/12/11/git-rebase/)git rebase

## 十四、git stash 贮藏当前 changes

- 有时候我们正在开发一个需求，还没开发完，我们要去另一个分支开发，我们没法切分支重新拉代码，它要求我们必须提交到本地仓库才能拉代码，所以此时我们可以将我们在本分支的 changes 先贮藏起来然后切分支，命令如下：
  ```ts
  git stash
  ```
- 使用该命令后我们做的 changes 就会被贮藏起来，我们可以到任何分支去拉代码或是修改，因为我们之前做的 changes 已经藏起来了，对外界是不可见的。
- 假设我们的另一个需求做完了，我们现在要切回原分支继续开发，我们可以先切到原分支，然后使用如下命令：

  ```ts
  git stash pop
  ```

- 上述命令会弹出我们最后一次贮藏的 changes，一般来说使用这个命令足够了，有时我们可能想要把所有贮藏的 changes 一起应用到当前分支，那么我们可以使用如下命令：

  ```ts
  git stash apply
  ```

- 当然我们也可以查看贮藏的 changes，命令与结果分别如下：

  ```ts
  git  stash list
  ```

  ```ts
  $ git stash list
  stash@{0}: WIP on master: 049d078 added the index file
  stash@{1}: WIP on master: c264051 Revert "added file_size"
  stash@{2}: WIP on master: 21d80a5 added number to log
  ```

- 删除某个 stash 自然也是可以的使用 `git stash drop 贮藏的名字`
  ```ts
  git stash drop stash@{0}
  ```
- 删除全部 stash

  ```ts
  git stash clear
  ```

上述命令平时的工作绝对够了，还有一些查看 diff 命令用的很少，我从来没用到，在此不做赘述。

## 希望每个人都不会因为 git 使用不熟练被同事嘲笑，最后祝大家编码顺利，不出 bug！
