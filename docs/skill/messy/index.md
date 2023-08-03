# 杂七杂八

## 获取中间位置

- 使用除以二然后再取整的方法

  - 痛点一：最小值与最大值的和有可能超出数字的精度范围。
  - 痛点二：必须调用数学方法进行取整。

  ```ts
  const low = 0,
    high = 10;
  const mid = Math.floor((low + high) / 2);
  ```

- 使用位运算

  - 痛点一：最小值与最大值的和有可能超出数字的精度范围。
    - 原理是因为右移 1 位后，二进制数最后一位的精度丢失导致自动向下取整，解决了需要调用数学方法的痛点。

  ```ts
  const low = 0,
    high = 10;
  const mid = (low + high) >> 1;
  ```

- 使用位运算并解决 low + high 超出安全表示范围的场景。
  - 解决了上述的两个痛点，上述痛点二解决原理不再赘述，痛点一的解决思路是，既然 low 与 high 各自都没有超出精度范围，那么 high- low 必定没有超出精度范围，这个值的一半也是同理，使用 low + 这个值的一半必定不会大于 high，因此表示是安全的。
  ```ts
  const low = 0,
    high = 10;
  const mid = low + ((high - low) >> 1);
  ```

## 性能优化

### 图片格式与体积优化

- 在 web 中我们可以使用精灵图也叫雪碧图配合 css 的 background-position 进行背景定位，这样子可以在本来需要加载多张小图的场景只加载一张图，然后通过背景定位的方式定位到当前需要展示的图片位置进行展示。
  - 优点：减小 http 并发请求数量，加快了图片资源的展示。（由多张图下载完成才能全部展示变为只需要下载一张图即可）。
  - 缺点：修改精灵图中单个图的时候需要整体替换原来图片，如果新的图片位置大小有调整，整体的图片需要挨个调整位置，使其正常展示，不方便。
- 将图片进行压缩，推荐使用[tiny](https://tinify.cn/)网站进行图片压缩，可大大减小图片体积，加快图片加载速度。
- 优化图片格式：
  - 简单介绍下下列图片格式：
    - jpg，可以用来进行展示色彩丰富的图片，其中没有 alpha 通道，因此不能展示透明像素，透明像素会默认渲染为白色底，在没有透明像素的情况下使用该格式相比于其他格式可以减小图片体积，加快图片加载速度。
    - png，可以用来展示带有透明像素的图片，该格式即使在压缩后也不会导致任何文件质量的损失。支持图像透明度，并提供比 GIF 更好的质量。该格式具有 256 级不透明度，从完全不透明到完全透明不等；该格式适合于存储图像的即时版本，因为重新保存不会导致质量损失；该格式支持广泛的颜色范围；不适合全彩色图像的展示。
    - gif，多用来创建动图，支持 alpha 通道，可展示透明像素，图片体积比 png 较大。
    - webp，与 png 格式类似，但是其体积远小于 png 格式，缺点是浏览器支持性较差，尤其是在 ios13 以下，不支持 webp 格式展示。
  - 色彩丰富的图片使用 jpg 格式，相比于其他格式体积更小。
  - 有透明像素的图片使用 png 格式，如果对只需要支持新版现代浏览器可使用 webp 格式优化图片体积。
  - 动图可使用 gif 格式，gif 格式对动图的支持性以及浏览器的兼容性都相当不错。

### 图片预加载

- 在工作中我们可以使用图片预加载来对图片展示进行优化，利用加载后的缓存来减小后续图片加载时间。
- 我们可以在 web 中通过创建图片的方式`new Image()`，在使用图片之前预先对图片进行加载，加载后的图片会缓存在客户端，在需要用到该图片的位置展示时会直接读取缓存的图片，大大减小图片后续加载图片引起的页面闪烁与时间。
  - 使用场景举例：如 web 的游戏界面，开始前需要读 loading 的进度条，其实这个时候是在加载后续用到的图片，使后续加载时页面中的图片可以做到秒开，增强用户体验。
- 优点：
  - 大大减小后续图片上屏时加载态与完成态的转换过程对用户的可见度，增强了用户体验，但本质上还是需要加载全部图片，只是相当于把后续加载需要的时间进行了提前，可以使用并发来加快图片加载，如果用户浏览完全部图片页面总体时间会减小。我们可以在此使用一个进度条或是百分比 loading 对用户展示当前进度，提升用户体验。
- 缺点：
  - 还是需要对图片进行加载，本质上是对图片的加载时间进行了提前，如果用户没有浏览预加载图片页面还是需要付出全部预加载的时间；
  - 如果用户没有浏览完全部预加载页面，那么就增大了 http 图片请求量，白白浪费前面 http 的请求与用户时间。

### 图片懒加载

- 图片懒加载是在即将用到图片时候提前进行加载，不用一次性加载多个图片，可以理解为延迟加载。
- 与预加载的区别：预加载是提前进行某一场景全部图片的加载，避免用户看到后续图片上屏引起页面中图片的加载态与完成态的转换；懒加载是即将要对用户展示该图片时，再进行加载，如果用户用不到这个图片就不进行加载，一个是预先加载一个是延迟加载，懒加载多用在列表页，对列表页面中的图片进行懒加载。
- 优点：
  - 用在列表页，如果用户只浏览了一屏的图片那么就不需要对整个列表的图片进行加载，减小了 http 的并发流量。
- 缺点：
  - 因为延迟加载了图片，网络条件差的情形下有时用户会看到图片的加载态与完成态的转换，但一般在类似场景中都是可接受的。
- 实现方案：
  一般来说有两种实现方案如下：
  - 第一种是首先不将图片地址放置到图片元素的 `src` 属性，例如可以使用 `data-src` 属性来暂时存储图片的地址，然后监听列表页`container`的滚动事件（`scroll`,`wheel`,`mousewheel`,`resize`,`animationend`,`transitionend`,`touchmove`），然后使用元素的`getClientRects()`或`getBoundingClientRect()`方法来获取图片元素距离视口的位置，判断到达某个阈值后将`data-src`放置到图片的`src`属性上进行加载图片，以此来达到图片加载的效果。注意在加载完成后即可销毁该元素对于位置的监听。
  - 第二种方案是使用 web 的 新 api [intersectioObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)来对图片元素进行位置监听，然后在进入屏幕或是某一个阈值进行对图片元素的`src`赋值。
  - 第一种方法兼容性更加优良，第二种方法实现起来更加简单，按需使用即可。

### 页面异步渲染大量数据

假设我们当前的页面有大量的数据进行上屏，比如有 10000 行表格内容，因为 js 是单线程的，如果我们一次性上屏的话页面会假死（卡住），无法响应用户事件，用户体验极差，但是我们又有如此多的数据需要上屏那么我们该怎么办呢？主要有以下两种方法：

- 使用定时器异步渲染 dom
  - 因为定时器是异步的宏任务，我们可以使用定时器异步进行页面渲染，这样就不会阻塞主线程对于用户事件的响应，可以提升用户体验。但是该方法有个缺点，如果用户的同步任务执行时间过长的话，那么定时器会一直延后进行执行，对于用户来说仍然会有页面卡顿无法响应用户事件的场景。
- 使用浏览器的 api [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame)来进行异步渲染，该 api 是浏览器用来绘制动画的，执行频率随着浏览器的刷新频率变化，在高刷新率的屏幕上该方法会执行的更快，一般为 16.7ms 执行一次。在这个方法的回调中，我们可以对 dom 进行操作，以此达到异步更新的效果，该 api 在注册之后不会被用户的同步任务所阻塞，该 api 最低支持 IE10 兼容性也相当不错。

### 接口数据分批上屏

当我们使用 Vue 或是 React 时，虽然界面是已经是异步更新，但是如果在一次的`setState`中如果更新大量的 dom 节点那么对于浏览器来说页面的渲染压力还是比较大的，那么我们可以怎样优化呢？

- 在 React 的类组件中我们知道`setState`的第二个参数是一个 callback，这个 callback 在 dom 更新后会调用，所以我们可以将数据分批上屏渲染来降低页面的首屏渲染压力，加快首屏渲染速度。

- useEffect 会在每次渲染后都执行吗？ 是的，默认情况下，它在第一次渲染之后和每次更新之后都会执行。（我们稍后会谈到如何控制它。）你可能会更容易接受 effect 发生在“渲染之后”这种概念，不用再去考虑“挂载”还是“更新”。React 保证了每次运行 effect 的同时，DOM 都已经更新完毕，可以在钩子中进行更新。

  - hooks 副作用调用如下：

    ```ts
    useEffect(() => {
      // 这里会在dom更新结束之后调用
    }, [依赖]);
    ```

  📢：注意一定要有退出条件，避免无限递归调用。

- Vue 中的 watch 钩子也是一样的，如下：

  - 当你更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调。默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新之前被调用。这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。如果想在侦听器回调中能访问被 Vue 更新之后的 DOM，你需要指明 flush: 'post' 选项：

  ```ts
  watch(source, callback, {
    flush: 'post',
  });
  watchEffect(callback, {
    flush: 'post',
  });
  ```

  - 后置刷新的 watchEffect() 有个更方便的别名 watchPostEffect()：

  ```ts
  import { watchPostEffect } from 'vue';

  watchPostEffect(() => {
    /_ 在 Vue组件 更新后执行 _/;
  });
  ```

  📢：注意一定要有退出条件，避免无限递归调用。

数据分批上屏也可以使用上文提到的`requestAnimationFrame`进行下一帧上屏，可以减小页面首屏首帧的渲染压力。

## 设置较小字号（小于 12px）的字体

web 中可设置的字体大小最小为 12px，无法设置小于 12px 的字体，目前大多数实现小字号的字体有以下常用两个方案

- 以我们需要设置 9px 的字体为例

### 使用 transform 缩放

```css
.ninepx-div {
  font-size: 12px;
  transform: scale(0.75);
  color: red;
}
```

我们可以设置字体大小为 12px 然后使用`transform:scale(0.75)`来让我们的元素进行缩放 3/4 以达到我们的 9px，但是该方案有个缺点就是元素的体积会塌陷，即盒子的大小会一起缩放，不会只缩放字体。

### 使用字体的 size-adjust 属性

```css
@font-face {
  font-family: ninepx;
  src: url('xxxx.ttf') format('truetype');
  size-adjust: 75%;
}
.ninepx-div {
  font-size: 12px;
  font-family: ninepx;
  color: red;
}
```

我们引入字体，然后设置 size-adjust 缩放比例，在我们需要缩放的文字上面我们可以使用该字体，然后设置相应的 12px 即可，因为缩放比例为 3/4 所以当我们设置 12px 时，该字体的展示大小就是 9px，该方案的好处是不会造成盒子的塌陷，盒子大小不会进行缩放，只会缩放字体。

## 文本省略

在此，记一个真的很 sb 的事情，在某个需求中有文本省略的需求，其中内容是运营配置的富文本，内容不可控，但是可以保证的是内容只有纯文本，需要一个展开收起的功能，此时我认为随便写一个多行文本省略就行了，于是快速敲下了如下的代码：

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
overflow: hidden;
text-overflow: ellipsis;
```

就在我为自己的聪明才智感到自豪时，我发现在 pc 端 web 中正常的文本到了 ios 与 android 上就变得不正常了，文本开始出现省略号后面的文本上来盖在前面的文本上，导致文本出现重叠的效果。一时间不知道如何解决，刚开始我以为是小程序的 bug，在拉了几个老哥的 oncall 后，发现不是小程序的 bug，是 ios 与 android 上的问题，在 web 中也存在该现象。于是乎我就在想是不是我的用法不正确导致的，最终确定都问题的位置是在运营配置的富文本内容里面有块元素标签导致的。后来将所有的内部元素都转成行内元素问题得到了解决。
以上就是血泪史，花了我半个下午的时间跟 oncall 老哥排查问题，算是一次教训。

### 单行文本省略

```css
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
```

### 多行文本省略

- css 实现
  ```css
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  ```
- js 实现
  - 挨个字符相加，每增加一个字符就判断一下外层容器的大小，直到外层容器的高度超出行数限制，然后用当前的文字拼接上`...`字符

### 📢 文本省略通过 css 实现必须遵循如下三个原则：

- 外层盒子必须具有宽度（或隐式宽度，可以理解为通过继承父级宽度得到的）
- **css 要添加到离文本内容最近的块级 dom 上，也就是说增加文本省略的元素内部必须全是行内标签！** 否则在 pc 浏览器中可以正常展示，在 ios 与 android 中无法正常展示。会出现覆盖现象或者省略号消失的问题。
- **不要写高度！不要写高度！不要写高度！** 一定不要写死 height 或者 min-height 以及 max-height 等跟高度相关的属性。

## 设计模式

### 单例模式

```ts
// 单例模式
class Person {
  static instance: Person;
  constructor(public name) {
    if (Person.instance) {
      return Person.instance;
    }
    Person.instance = this;
  }
  sayHello() {
    console.log(`hello ,我的名字是${this.name}`);
  }
}
```

### 观察者模式、发布订阅

```ts
class PubAndSub {
  map = new Map<string, Set<(data: any) => void>>();
  subscribe(event: string, callback: (data: any) => void) {
    if (!this.map.has(event)) {
      this.map.set(event, new Set());
    }
    const dep = this.map.get(event)!;
    dep.add(callback);
  }
  publish(event: string, data: any) {
    if (this.map.has(event)) {
      const dep = this.map.get(event)!;
      dep.forEach(callback => {
        callback(data);
      });
    }
  }
  remove(event: string, callback?: (data: any) => void) {
    if (this.map.has(event)) {
      const dep = this.map.get(event)!;
      if (callback) {
        if (dep.has(callback)) {
          dep.delete(callback);
        }
      } else {
        dep.clear();
      }
    }
  }
  removeAll() {
    this.map.clear();
  }
}
```

## 深拷贝

- 使用 JSON
  - 优点：简单直接，使用方便。
  - 缺点：无法解决循环引用，无法深拷贝函数。
  ```ts
  JSON.parse(JSON.stringfy(obj));
  ```
- 使用递归
  - 使用 cache 缓存上次递归调用过的数据，下次不需要递归即可直接取到值，解决了无限递归超出调用栈的问题。
  ```ts
  function deepCopy(obj: any, cache = new WeakMap()) {
    if (typeof obj === 'object' && obj !== null) {
      const isArray = Array.isArray(obj);
      let temp = isArray ? [] : {};
      //map缓存中是否存在当前对象或数组
      if (cache.has(obj)) {
        //如果存在那么直接返回当前的对象或数组
        return obj;
      }
      //如果不存在那么就添加到缓存中
      cache.set(obj, temp);
      for (const key in obj) {
        //递归拷贝 将缓存区传给下一个递归
        temp[key] = deepCopy(obj[key], cache);
      }
      return temp;
    }
    //如果不是对象是个单一类型的值直接返回
    return obj;
  }
  ```

## npm、yarn、pnpm 区别是什么？

### npm

- npm2
  npm2 中的 node_modules 是嵌套的，也就是说我们装的模块内部仍然还有 node_modules 模块层层嵌套，这不是最主要的问题。这样带来的坏处就是某个深层次的文件夹路径名会特别长，在 windows 电脑下文件路径最长 260 个字符，也就是说当文件嵌套层级过深时是有问题的。
- npm3
  - npm3 是在 npm2 的基础上的升级版，主要也是解决模块嵌套的问题，它将模块都打平放置到了最外层的 node_modules 中，解决了文件嵌套的问题。
  - npm3 虽然解决了深层嵌套的问题，仍然留有一个幽灵依赖的问题，那就是我们没有在 dependencies 中声明的依赖我们居然可以导入进来，这是因为我们依赖的某些库有该依赖，假设我们也对该依赖进行了使用，我们又没有明确安装该依赖那么如果有一天我们所依赖的另一个库不在依赖该模块时我们的应用程序就无法正常运行。

### yarn

- yarn
  - 在 npm2 有嵌套文件这个缺点后 yarn 横空出世了，它把 node_modules 依赖打平全部放到了最外层的 node_modules 中，解决了文件嵌套的问题。
  - yarn 也存在幽灵依赖的问题。

### pnpm

- pnpm 另辟蹊径不在将文件放置到当前目录下，而是将模块放置到全局中，然后通过软连接将其指向到我们全局中的模块，在我们当前目录下的 node_modules 中只能找到我们显示声明的依赖，这样就解决了幽灵依赖的问题。
- 其次，因为我们所依赖的包在我们的全局已经被安装后在下次又需要该模块时就不需要再次进行安装，只需要链接到该模块的地址即可，这样无疑可以省略一次安装包的过程以及可以省略该包所需要占据的磁盘空间，优化了占用体积。

## 原型与原型链

在 JavaScript 中每一个对象都有一个原型，属性名为`__proto__`这个是对象的隐式原型，函数也是一个对象，函数也有自己的隐式原型。除此之外函数还有自己的显式原型`prototype`，在 es5 中还没有`class`关键字，此时若想实现继承就是利用了原型链。

### 前置知识

- 当在一个对象身上获取属性时，会先在自己的对象内部查找是否存在该属性，若可以在对象内部查找到该属性则直接返回该属性，若查找不到则到该对象的隐式原型上去查找该属性，他的隐式原型也是一个对象，在隐式原型上查找的链路也是一样的，一直查到隐式原型为`null`为止，若此时还没有找到该对象的属性则返回`undefined`，表明该对象内部不存在该属性。

### new 关键字所做的事情

- 当我们使用`new`关键字对一个函数进行调用时，内部做了两件事，如果我们的函数内部没有返回值，则帮我们创建一个空对象，并把函数内部的`this`指向该空对象，然后把我们当前函数的显式原型`prototype`赋值给我们当前对象的隐式原型`__proto__`上，因为我们在对象身上查找属性或者方法时，若自身不存在则到隐式原型上去查找，所以我们可以使用该方法实现继承的能力。

### 显式原型 prototype 中的构造器 constructor

- 在我们函数的显式原型上存在一个构造器`constructor`，该构造器指向我们当前的函数
  ```ts
  function Person() {
    // do something
  }
  ```
  如上述`Person`类中，`Person.prototype.constructor === Person`的结果是`true`，内存图如下所示：
  ![原型链](/images/prototype.webp)

## 继承

在 es5 中实现继承使用到的知识非常多，有原型链继承，盗用构造函数继承，寄生类继承，组合继承等等。

### 原型链继承

```ts
function Person(name, age) {
  this.name = name; // 父类中存在一份
  this.age = age; // 父类中存在一份
  this.sayHello = function () {
    console.log(`hello,${this.name}`);
  };
}

function Student(name, age) {
  this.name = name; // 子类中存在一份
  this.age = age; // 子类中存在一份
}

Student.prototype = new Person('foo', 18);

const stu = new Person('bar', 17);
stu.sayHello();
```

- 原理是将父类的实例赋值到子类的显式原型上，因为查找顺序是先查找子类实例自身，然后查找子类实例隐式原型，又因为`new`关键字会将显式原型绑定到实例的隐式原型上，因此查找的实例隐式原型其实就是构造函数`Person`的显式原型，因此可以在子类上读取到父类的方法。

- 缺点也很明显，我们无法继承父类的属性，因为父类一旦实例化，内部的属性就已经确定了，只能继承父类的方法，若想使用属性则只能在子类里实现。也就是说我们想要继承的属性必须要存在两份，子类中一份，父类中也存在一份。

在以上缺点的基础上出现了盗用构造函数继承。

### 盗用构造函数继承

盗用构造函数继承主要解决的问题是在子类中无法继承父类的属性而出现的。
原理如下：

```ts
function Person(name, age) {
  this.name = name; // 父类中存在一份
  this.age = age; // 父类中存在一份
  this.sayHello = function () {
    console.log(`hello,${this.name}`);
  };
}

function Student(name, age) {
  // 重点是在子类中调用父类的构造函数，并绑定this
  Person.call(this, name, age);
  // this.name = name;  子类中存在的一份可以删除
  // this.age = age; 子类中存在的一份可以删除
}

Student.prototype = new Person('foo', 18);

const stu = new Person('bar', 17);
stu.sayHello();
```

- 重点是在子类的方法中通过`call`或者`apply`调用父类的构造函数并绑定`this`，因此，在父类中的`this.name = name`,实际上是将`name`绑定到了当前的子类上。此时父类的构造函数被调用两次，其中第一次调用时将父类的实例赋值给子类的显式原型，此时也是有一份父类的属性保存在子类构造函数的的显式原型上的，第二次是将子类的实例自身上通过`call`或`apply`绑定上父类构造函数中声明的属性，`因为查找顺序是有限在子类实例自身上查找，查找不到再去子类实例的隐式原型也就是子类构造函数的显式原型上去查找`，所以相当于是子类实例上的属性覆盖了子类隐式原型上赋值的父类实例的属性。
- 该方法也有一个缺点，缺点是父类的构造函数被调用了两次。
  1. 第一次是父类实例化后赋值给子类构造函数的显式原型。
  2. 第二次是盗用构造函数时通过`call`或`apply`又调用了一次。

为了解决上述的父类构造函数调用两次的问题，出现了寄生继承与原型式集成。

### 寄生继承与原型式集成

- 寄生继承的原理是构造一个对象，让他的隐式原型指向父类构造函数的显式原型，然后将该对象作为子类构造函数的显式原型。
  原理如下：

```ts
function Person(name, age) {
  this.name = name; // 父类中存在一份
  this.age = age; // 父类中存在一份
  this.sayHello = function () {
    console.log(`hello,${this.name}`);
  };
}
function createObj(Parent) {
  // return Object.create(Parent.prototype); 可以直接返回该对象，Object.create方法会创建一个对象，并让其的隐式原型指向参数中的值
  // 下面是兼容性更好的方法再2006年提出
  function F() {}
  F.prototype = Parent.prototype;
  return new F();
}
Student.prototype = createObj(Person);
function Student(name, age) {
  // 重点是在子类中调用父类的构造函数，并绑定this
  Person.call(this, name, age);
}

Student.prototype = new Person('foo', 18);

const stu = new Person('bar', 17);
stu.sayHello();
```

- 上面使用了`Object.create()`方法，该方法会创建一个对象，并将该对象的隐式原型设置为传入的第一个参数，因此我们创建出来的对象的隐式原型就是父类构造函数的显式原型，因此将其作为子类构造函数的显式原型即可实现方法的继承。
- 属性的继承我们还是使用了盗用构造函数的方法，与上述不同的是，本次只调用了一次父类的构造函数，因此父类上定义的属性只存在一份，也就是绑定在子类的实例上。
  行文至此，在 es5 中的继承方式基本讲述完毕，相比之下最优的继承方案使用了原型链、盗用构造函数、原型式继承、寄生继承这四种才得到一个相对完美的继承方案。
