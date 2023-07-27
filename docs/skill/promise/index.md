# Promise 与异步任务

## promise 与 async、await

### 一、回调地狱

在 es6 兴起之后许多人都开始使用**promise**，promise 目的是解决 es5 中的回调地狱（callback hell），那么什么是回调地狱呢？**先来提一个需求，现在需要发送 n 个 request 请求，第二个请求参数需要第一个请求的结果，第三个请求的参数需要第二个请求的结果，以此类推...** ，在没有 promise 的条件下，我们不难使用 callback 写出如下的代码：

```js
function ajax(url, callback) {
  setTimeout(() => {
    callback(Math.random() + url);
  }, 1000);
}

function request() {
  ajax('url1', res1 => {
    ajax(`url2?random=${res1}`, res2 => {
      ajax(`url3?random=${res2}`, res3 => {
        ajax(`url4?random=${res3}`, res4 => {
          // do something
        });
      });
    });
  });
}

request();
```

### 二、Promise

这样确实能实现我们的需求，但是这样子的代码有什么缺点呢？不难看出我们的 request 函数**越来越像个三角形** ，代码集中在上部分，下半部分全都是我们的括号，**代码阅读性极差！** 这时候我们的 promise 应运而生了，使用 promise 我们可以这样重构我们的代码如下：

```js
function ajax(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random() + url);
    }, 1000);
  });
}

function request() {
  ajax('url1').then(res1 => {
    ajax(`url2?random=${res1}`).then(res2 => {
      ajax(`url3?random=${res2}`).then(res3 => {
        ajax(`url4?random=${res3}`).then(res4 => {
          // do something
        });
      });
    });
  });
}

request();
```

肯定有人说，这不还是像个三角形吗？这样使用 promise 有什么意义呢？此时我们可以**借助 promise 的链式调用**重构成下面这样：

```js
function ajax(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random() + url);
    }, 1000);
  });
}

function request() {
  ajax('url1')
    .then(res1 => {
      return ajax(`url2?random=${res1}`);
    })
    .then(res2 => {
      return ajax(`url3?random=${res2}`);
    })
    .then(res3 => {
      return ajax(`url4?random=${res3}`);
    })
    .then(res4 => {
      // do something
    });
}

request();
```

相对于之前的回调地狱，此时我们的代码是不是比较清晰了。但是！这还不够！这看上去还不够直观。我们想要的是阅读异步代码，类似于阅读同步代码的方式一样方便。

### 三、生成器（generator）

**生成器**是 es6 新增的语法，它是一个特殊的迭代器，**它可以用来暂停我们函数的执行！这个功能非常强大！** 生成器的语法是，在声明函数时在后面增加一个 \* 号，那么这个函数就是生成器函数，直接调用该函数得到的是一个生成器句柄，该生成器是不会执行的，必须要调用生成器句柄的 next()方法后，生成器才会执行，并且执行到我们的 yield 处（**如果存在 yield 就执行到第一个 yield，不存在则直接执行完毕**）,该方法的返回值一个对象，结构是 **{done: true/false, value: 我们 yield 后面跟的值}** ，如果执行到该生成器函数末尾则 **done 为 true**。
[关于生成器的知识可以点此处查看更多](https://juejin.cn/post/7141685685940912136)

```js
function* foo() {
  console.log('======');
  const a = yield 1;
  console.log('a', a);
}

const g = foo();
console.log('11111111');
const res1 = g.next();
console.log(res1);
const res2 = g.next('22222');
console.log(res2);
```

上面代码打印顺序为：

```js
11111111
======
{done: false, value: 1}
'a','22222'
{done: true, value: undefined}
```

细心的你一定看出了，我们在 next 方法中传的参数会赋值给生成器函数中的 yield
左侧，并可以在生成器中拿到这个值后进行使用。

### 四、使用生成器同步化 promise

掌握了生成器的知识我们就可以**使用生成器来将我们的 promise 链式调用进行重构**如下：

```js
function ajax(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random() + url);
    }, 1000);
  });
}

function* request() {
  const res1 = yield ajax('url1');
  const res2 = yield ajax(`url2?random=${res1}`);
  const res3 = yield ajax(`url3?random=${res2}`);
  const res4 = yield ajax(`url4?random=${res3}`);
  //    do something
  console.log(res4);
}
// 开始调用我们的生成器
const generator = request();
generator.next().value.then(res1 => {
  generator.next(res1).value.then(res2 => {
    generator.next(res2).value.then(res3 => {
      generator.next(res3).value.then(res4 => {
        generator.next(res4);
      });
    });
  });
});
```

可以看到我们的生成器还是三角形，优化一下成链式调用如下：

```js
generator
  .next()
  .value.then(res1 => {
    return generator.next(res1).value;
  })
  .then(res2 => {
    return generator.next(res2).value;
  })
  .then(res3 => {
    return generator.next(res3).value;
  })
  .then(res4 => {
    generator.next(res4);
  });
```

此时，我们的主函数已经非常像同步代码了，但是缺点是我们目前必须手动调用该生成器，并且 request 主函数里面我们不知道有多少次 yield 调用，因此我们的生成器也不能手动调用多次，这时，我们将该生成器调用代码进行重构，重构成可以自动执行我们的生成器的函数，不需要关心 request 内部有多少次 yield 使用，重构如下：

```js
function ajax(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random() + url);
    }, 1000);
  });
}

function* request() {
  const res1 = yield ajax('url1');
  const res2 = yield ajax(`url2?random=${res1}`);
  const res3 = yield ajax(`url3?random=${res2}`);
  const res4 = yield ajax(`url4?random=${res3}`);
  //    do something
  console.log(res4);
}

function execGenerator(generatorFn) {
  const generator = generatorFn();
  function exec(res) {
    const { done, value } = generator.next(res);
    if (!done) {
      value.then(exec);
    }
  }
  exec();
}

execGenerator(request);
```

我们增加了一个自动执行函数**execGenerator**，该函数接受一个生成器参数，并且在内部自动进行递归调用，直至返回值的 **done** 属性为 **true**，此时我们的使用方式只需要定义一个 request 生成器函数，并且执行一下我们的自动执行函数 **execGenerator** ，我们的 request 就能像同步代码一样盘跑起来了，并且看起来非常直观。

### 五、async、await 异步代码究极解决方案

其实 async 与 await 是我们上面生成器的语法糖而已，在内部做的事情跟我们使用生成器做的事情是一样的，使用方式如下：

```js
function ajax(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random() + url);
    }, 1000);
  });
}

async function request() {
  const res1 = await ajax('url1');
  const res2 = await ajax(`url2?random=${res1}`);
  const res3 = await ajax(`url3?random=${res2}`);
  const res4 = await ajax(`url4?random=${res3}`);
  //    do something
  console.log(res4);
}
```

看起来是不是跟我们的生成器 request 函数非常类似呢？使用**async**与**await**可以让我们省去写 execGenerator 函数的步骤，更加方便了我们的开发！

## 异步任务控制并发数

### 背景

假设我们有一个图片预加载的需求，但是我们需要控制图片预加载时的请求并发量，请设计一个函数实现上述功能。

### 实现

我们的思路：

1. 首先我们会设计一个函数来执行异步任务，然后设计一个 limit 的变量来控制最大并发量，然后我们使用一个任务池来存储档期的任务，当任务池中的数量达到最大并发量时，我们 await `Promise.race`有结束的任务即可。

代码实现如下：

```ts
async function doSomething(tasks: (() => Promise<void>)[], limit = 2) {
  // 正在执行的任务池
  // 任务池使用set来做主要是方便删除当前的任务
  const pool = new Set();
  for (const task of tasks) {
    // 执行任务
    const promise = task();
    // 任务池中增加当前任务
    pool.add(promise);
    // 当前任务结束时任务池中删除该任务
    promise.then(() => pool.delete(promise));
    // 当任务池中任务数量达到并发上限时需要等待任务池中任务结束一个才继续执行下一个任务
    if (pool.size >= limit) {
      await Promise.race(pool);
    }
  }
  // 最后的任务池中的任务执行完毕
  return Promise.all(pool);
}

const sleep = (timeout: number, taskName: string) => {
  return new Promise<void>(resolve => {
    console.log(`${taskName}start`);
    setTimeout(() => {
      console.log(`${taskName}end`);
      resolve();
    }, timeout);
  });
};

const tasks = [
  () => sleep(1000, '吃饭'),
  () => sleep(1000, '打游戏'),
  () => sleep(3000, '写代码'),
  () => sleep(5000, '睡觉'),
  () => sleep(7000, '锻炼身体'),
];
doSomething(tasks, 4).then(() => console.log('全部结束了'));
```

- 上述代码中的 tasks 任务队列可以替换成真实的图片请求即可，上述代码不变，新增代码如下：

```ts
function getLoadImagesTasks(urls: string[]) {
  const tasks: (() => Promise<void>)[] = [];
  urls.forEach(url => {
    tasks.push(
      () =>
        new Promise<void>(resolve => {
          const img = new Image();
          console.log(url + 'start');
          img.onload = () => {
            console.log(url + 'end');
            resolve();
          };
          img.src = url;
          // error 场景暂不考虑
        })
    );
  });
  return tasks;
}

const urls = [
  'https://www.kkkk1000.com/images/getImgData/getImgDatadata.jpg',
  'https://www.kkkk1000.com/images/getImgData/gray.gif',
  'https://www.kkkk1000.com/images/getImgData/Particle.gif',
  'https://www.kkkk1000.com/images/getImgData/arithmetic.png',
  'https://www.kkkk1000.com/images/getImgData/arithmetic2.gif',
  'https://www.kkkk1000.com/images/getImgData/getImgDataError.jpg',
  'https://www.kkkk1000.com/images/getImgData/arithmetic.gif',
  'https://www.kkkk1000.com/images/wxQrCode2.png',
];

doSomething(getLoadImagesTasks(urls), 2).then(() => console.log('全部结束了'));
```

- 至此我们的控制并发数量的异步任务已经完成了，可以通过修改 limit 参数来控制异步任务的并发数量，达到了可控的效果。
