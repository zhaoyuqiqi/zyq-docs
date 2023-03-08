# 二叉树

- 说到二叉树避免不了要谈到树的遍历，既然要遍历那么主要有以下几种遍历方式，分别是**前序遍历**、**中序遍历**、**后序遍历**、**层序遍历**。

- 前三种遍历方式使用递归较多，层序遍历多使用循环，递归本质上是使用的栈数据结构；层序遍历的循环使用的队列数据结构。

## 二叉树的遍历

### 二叉树的前序遍历

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
var preorderTraversal = function (root) {
  const ret = [];
  function dfs(node) {
    if (!node) return [];
    ret.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return ret;
};
```

### 二叉树的中序遍历

```js
var inorderTraversal = function (root) {
  const ret = [];
  function dfs(node) {
    if (!node) return [];
    dfs(node.left);
    ret.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return ret;
};
```

### 二叉树的后序遍历

```js
var postorderTraversal = function (root) {
  const ret = [];
  function dfs(node) {
    if (!node) return [];
    dfs(node.left);
    dfs(node.right);
    ret.push(node.val);
  }
  dfs(root);
  return ret;
};
```

### 二叉树的层序遍历

- 层序遍历使用的是队列，类似于广度优先算法。

```js
var levelOrder = function (root) {
  //二叉树的层序遍历
  let res = [],
    queue = [];
  queue.push(root);
  if (root === null) {
    return res;
  }
  while (queue.length !== 0) {
    // 记录当前层级节点数
    let length = queue.length;
    //存放每一层的节点
    let curLevel = [];
    for (let i = 0; i < length; i++) {
      let node = queue.shift();
      curLevel.push(node.val);
      // 存放当前层下一层的节点
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
    //把每一层的结果放到结果数组
    res.push(curLevel);
  }
  return res;
};
```
