# 面试题目汇总

## 微派

### 一面

1. 介绍一下自己，讲一下最近一份工作中的印象比较深的难点以及如何解决的？
2. Vue2 与 Vue3 的区别；

- diff 算法
- 响应追踪
- 组合式 api 与选项 api
- ...

3. 为什么要用虚拟 dom？

- 进行 diff 更加方便；
- 可缓存 dom 节点；
- 跨平台更加方便，可以自定义渲染器，抹平了平台之间的差异；
- ...

4. 实现一个类似于微信抢红包的函数，保证每个人一定可以抢到红包并且他们的金额差距在一个范围内不会过大。

- 我这边的实现如下：

  ```ts
  function fn(money: number, count: number) {
    const res: number[] = [];
    for (let i = 0; i < count; i++) {
      // 获取当前的平均值
      const avg = Number((money / (count - i)).toFixed(2));
      // 两个不同的红包的差值
      const val = Number((Math.random() * 0.5).toFixed(2));
      // 当前的红包金额
      let cur = Math.random() > 0.5 ? avg + val : avg - val;
      // 最后一个时直接把全部红包发放给用户
      if (i === count - 1) {
        res.push(Number(money.toFixed(2)));
      } else {
        // 其他时候把当前的金额发放给用户，总金额减少当前的值
        res.push(Number(cur.toFixed(2)));
        money -= cur;
      }
    }
    // 最后返回红包金额数组
    return res;
  }
  ```

  - 其中，我的实现最初是用的总金额的平均值，这种情况下需要判断会不会发放超额，在面试官的引导下，我修改为当前的金额值，且对 money 做了一次`money -= cur`的操作，我之前是没有对 money 做操作的，而是循环一次取一次发放总金额然后用总金额减去发放金额，还是感谢面试官的提醒加引导！

- 最后就是反向提问环节。

### 二面

1. 介绍一下自己，讲一下最近一份工作中的印象比较深的难点以及如何解决的？
2. 计算机网络部分

- 比如 304、什么时候会命中缓存？
- option 请求什么时候发送？
- 协商缓存和强缓存

3. 给定一个字符串数组`list`，如何查找出其中以某字符串开头的值的集合？

```ts
const list = ['goods', 'goodsoods', 'good'];
```

```ts
function search(list: string[], keyword: string) {
  return list.filter(item => item.startWith(keyword));
}
```

4. 询问了如何增强上述查询的效率：

- 我回答了把其中的数据存储为哈希表的格式:

```ts
const list = {
  goods: ['goods', 'goodsoods'],
  good: ['goods', 'goodsoods', 'good'],
};
```

- 面试官说这个可以，但是太耗费内存了，让我想一下有没有其他的方式。

  - 最后在面试官的提示下有了如下数据结构：

  ```ts
  const list = {
    g: {
      end: 'g',
      o: {
        end: 'go',
        o: {
          end: 'goo',
          d: {
            end: 'good',
            s: {
              end: 'goods',
            },
          },
        },
      },
    },
  };
  ```

5. 然后就是让我把最开始的`list`转换成上述树结构。

- 给的时间比较少当时确实没有写出来。
- 面试结束后，我觉得自己凉了，然后就自己静下心来重新写了下这个题目：

```ts
function list2tree(list: string[]) {
  /** 字符串转为树 */
  function str2tree(str: string) {
    const res = {};
    let curObj = res;
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      curObj[char] = {
        end: str.slice(0, i + 1),
      };
      curObj = curObj[char];
    }
    curObj.end = str;
    return res;
  }
  /** 深层次合并两个对象 */
  function mergeObj(o1: object, o2: object) {
    const obj = {};
    for (const key of Object.keys(o2)) {
      if (isObj(o1[key]) && isObj(o2[key])) {
        obj[key] = mergeObj(o1[key], o2[key]);
      } else {
        obj[key] = o2[key];
      }
    }

    for (const key of Object.keys(o1)) {
      if (!o2.hasOwnProperty(key)) {
        obj[key] = o1[key];
      }
    }
    return obj;
  }
  /** 判断是否是一个对象 */
  function isObj(o: any): o is object {
    return typeof o === 'object' && o !== null;
  }
  /** 先把每个字符串都转成对象，然后合并数组中的对象 */
  return list.map(str2tree).reduce(mergeObj, {});
}
```

6. 最后说一句，我以为自己凉凉了，结果最后面试官还让我过了。
