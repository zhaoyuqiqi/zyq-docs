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

4. 实现一个类似于微信抢红包的函数，保证每个人一定可以抢到红包并且他们的金额差距在一个范围内不会过大。 - 我这边的实现如下：
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
