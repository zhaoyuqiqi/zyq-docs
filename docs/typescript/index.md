# Typescript

## 基本编程式语法

### keyof

- keyof 操作符类似于把一个对象的 key 取出来然后返回这些 key 组成的联合类型

### in 操作符

- xxx in 联合类型
- 我们可以在任何时候对**联合类型**使用**in**操作符来遍历出**联合类型的每一项**

### 数组（元组）的遍历

- 我们可以使用如下的索引方式来遍历数组或元组类型，返回的类型为联合类型如下，既然是联合类型那么我们可以使用 in 操作符对其进行枚举

```typescript
type tuple = [number, string, boolean];

// 此时foo的类型为 number|string|boolean 联合类型，意为将tuple中挨个遍历出来
type foo = tuple[number];
```

- 数组可以使用拓展运算符...来展开数组获取其中的元素

```typescript
type A<U extends any[]> = [...U];
type B = A<[1, 2, 3]>;
// 此时B的类型为[1,2,3]
```

### 对象的遍历

- 使用映射来遍历对象，keyof 一个对象时，返回值为对象的全部 key 的联合类型

```typescript
type obj = {
  name: string;
  age: number;
};
type bar = {
  [key in keyof obj]: obj[key];
};
// 其中不只条件判断可以放在 [key in keyof obj] 处，也可以放在 obj[key]这个位置
```

- 可以使用 keyof T[K] 是否 extends never 来判断当前 T[K]是否是一个对象，如果是对象则不成立，如果不是一个对象则进入 true 分支

```typescript
type DeepReadonly<T extends Record<string, any>> = {
  readonly [P in keyof T]: keyof T[P] extends never ? T[P] : DeepReadonly<T[P]>;
};
```

### 字符串的遍历

- 字符串类型想要遍历，此时我们必须使用模板字符串和 infer 关键字的组合再使用递归即可,例如我们要获取某个字符串的每个字符的联合类型我们可以使用如下方法，其中**F**指的是字符串**s**的第一个字符，**Rest**指的是字符串**s**的剩余字符，我们只需要进行递归即可完成整个字符串的遍历

```typescript
type Foo<s extends string> = s extends `${infer F}${infer Rest}` ? `${F}` | Foo<Rest> : never;
```

### extends 语法

- extends 可以用来约束某个属性的范围
- 如果 extends 左侧是联合类型则会将左侧的联合类型遍历一遍挨个执行,即分布式条件判断。
  - 在分布式条件判断中，例如此时 K 是联合类型，K extends U ？ **K** ：never 加粗的 K 即为联合类型中的每个单独的类型。
- 在条件分支中，如 **A extends B** 表示满足**A**的必定满足**B**此时才会进入 **true** 分支

### 重映射 as

- [TypeScript 之 映射类型（重映射）](https://juejin.cn/post/7090190356737703973)

- [TS 类型体操：索引类型的映射再映射](https://www.51cto.com/article/699699.html)

### 为对象添加属性

- 为对象 T 添加 U 属性（比较巧妙使用了 in 操作符）

```typescript
type AppendToObject<T, U, V> = { [P in keyof T | U]: P extends keyof T ？ T[P]: V };
```

### 字符串与数字的互相转换

```typescript
type S2N<S extends string> = S extends `${infer N extends number}` ? N : never;
type N2S<N extends number> = `${N}`;
type A = S2N<'100'>;
type B = N2S<100>;
```

## Typescript 类型体操

### ReturnType

- TS 内置类型 ReturnType 实现：

  - 在实现 ReturnType 之前我们需要了解一下 infer 的使用，infer 是推断的意思，在这里我们可以将其当做一个占位符，当传入真实的类型时这个占位符就会变成我们真实的类型，此时就可以获取了。
  - 我们实现 MyReturnType 类型，其中传入泛型 T，T 受函数类型的约束，当 T 进入条件判断为 true 分支时，T 的返回值是我们的推断类型 S，此时我们将 S 返回即可，当我们真实的类型传入后，如果条件判断走到了 true 分支那么我们的推断类型 S 就是我们真实的函数的类型。

  ```ts
  type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer S
    ? S
    : never;
  ```

### Record

- TS 内置类型 Record 实现：
  - 想要实现 Record 之前我们需要了解一下该类型的作用，它可以用来声明一个对象，其中 key 是`Record<K,V>`的 K 类型, value 是其中的 V 类型，我们该如何实现呢？
  - 首先我们需要了解 TS 类型系统中如何遍历对象的 key 以及如何让该 key 变为可选或是只读等操作。
  - 在学会上述的知识后，我们开始实现如下：
  ```ts
  type MyRecord<K extends keyof any, V> = {
    -readonly [P in K]+?: V;
  };
  ```

### Omit

- TS 内置类型 Omit 实现：

  - Omit 类型是从某个对象中删除一个 key，我们可以使用两种思路进行手写。

    - 使用内置类型 Exclude；
    - 使用对象的重映射；

  - 代码实现如下：

  ```ts
  type Obj = {
    name: string;
    age: number;
  };

  type MyOmit<O, K> = {
    [P in Exclude<keyof O, K>]: P;
  };
  type MyOmit2<O, K> = {
    [P in keyof O as P extends K ? never : P]: P;
  };
  type Test = MyOmit<Obj, 'age'>;
  type Test2 = MyOmit2<Obj, 'age'>;
  ```

## 在 node 项目中使用 ts

### 有时候我们需要在 node 项目中使用 ts 来运行我们的项目，例如开发过程使用`nodemon`和`ts-node`来运行我们的项目，有以下几点需要注意：

- 此时我们一定要注意不要在`package.json`中增加`type`字段否则会报错不兼容。
- 在 ts-config 中需要配置`module`为`commonjs`，`moduleResolution`不需要配置。

### 配置全局类型声明

倘若我们需要需要配置全局的类型，我们可以在任意的地方配置`.d.ts`文件，如果文件没有使用`export`和`import`那么该声明文件会被当做全局声明文件，可以直接被编辑器读取，我们的 vscode 也是可以识别的。但是识别归识别，我们使用`nodemon` + `ts-node`仍然无法运行我们的项目，我们的`ts-node`无法读取到全局类型，此时需要我们在`tsconfig`中对`ts-node`进行配置如下：

```json
{
  "compilerOptions": {
    // ...省略部分配置...
  },
  "includes": [
    // 这里是文件列表
  ],
  "ts-node": {
    "files": true
  }
}
```

`ts-node`中的`files`会加载`tsconfig`中的 files 字段与 includes 字段，其中 files 需要显示声明哪些文件不方便使用，可以不去声明，我们可以直接声明 includes 列表，该列表可以使用 glob 匹配，使用起来方便。在配置完这些后 ts-node 就可以正常使用了。
如果

### 使用别名

ts 类型的别名我们只需要在 tsconfig 中配置 path 字段即可，但是我们配置后 ts-node 编译时仍然不认识别名，我们需要使用`tsconfig-paths`来做，首先安装该 npm 包，然后使用时一行代码即可`nodemon --exec \"ts-node -r tsconfig-paths/register\" src/main.ts`
查看下 ts-node 的官方文档比较好

## 前端 Typescript 组件

### 背景

许多时候我们在编写 ts 代码或组件时会遇到许多问题，如：

- 场景 1：我有一个组件接收两个属性，一个为`type`另一个为`data`，且当`type`为`string`时，`data`为`number`；当`type`为`number`时，`data`为`string`
- 场景 2：我有一个列表，列表中存储的是组件信息，每个组件信息各不相同，我想在编写该列表时可以自动根据填写的 type 推断出我需要的组件类型

### 场景一：

- ```html
  <!-- 当传递type为foo时，data是数字 -->
  <Test type="foo" :data="1" />
  <!-- 传递type为bar时，data为字符串  -->
  <Test type="bar" data="1" />
  ```

是不是要声明两个组件呢？如果不声明两个组件应该怎么写组件呢？

- 方法一：泛型

- ```vue
  <!-- test.vue -->
  <script lang="ts">
  type Type = 'foo' | 'bar';
  </script>

  <script setup lang="ts" generic="T extends Type">
  interface Props {
    type: T;
    data: T extends 'foo' ? number : T extends 'bar' ? string : never;
  }
  defineProps<Props>();
  </script>

  <template></template>
  ```

万一有多个 type 的值呢？连续的三元表达式？

- 方法二：泛型+infer

  `infer` 最早出现在此 PR 中，`表示在 extends 条件语句中待推断的类型变量`。
  简单示例如下：

- ```ts
  type ParamType<T> = T extends (arg: infer P) => any ? P : T;
  ```

- 在这个条件语句 `T extends (arg: infer P) => any ? P : T` 中，`infer P` 表示待推断的函数参数。
- 整句表示为：`如果 T 能赋值给 (arg: infer P) => any，则结果是 (arg: infer P) => any 类型中的参数 P，否则返回为 T。`
- ```ts
  interface User {
    name: string;
    age: number;
  }

  type Func = (user: User) => void;

  type Param = ParamType<Func>; // Param = User
  type AA = ParamType<string>; // string

  看下内置的工具类型：ReturnType

  ```

- ```ts
  type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
  ```

  通俗一点讲：`infer` 表示未来真实传递的类型，在声明时可认为占位符或形参，配合泛型使用。
  请看下列代码
  test2.vue

- ```vue
  <script lang="ts">
  type Type = 'foo' | 'bar';
  </script>
  <script setup lang="ts" generic="T extends Type">
  // 额外增加个Data
  interface Data {
    foo: number;
    bar: string;
  }
  interface Props {
    type: T;
    // 只有这一块有改动
    data: T extends infer U ? (U extends Type ? Data[U] : never) : never;
  }
  defineProps<Props>();
  </script>
  <template></template>
  ```

- 方法三 不使用泛型
  首先我们学习 `type`，`type` 可以定义联合类型，交叉类型等

- ```ts
  type Int = number | string;

  interface Bird {
    name: string;
    age: number;
    fly(): void;
  }
  interface Dog {
    name: string;
    age: number;
    run(): void;
  }

  type X = Bird & Dog;

  // x 必须既包含 Bird 也包含 Dog 的属性与方法
  ```

我们还要知道

- ```ts
  type Arr = [string, number, boolean];

  type U1 = Arr[0] | Arr[1] | Arr[2]; // string | number | boolean
  type U2 = Arr[0 | 1 | 2]; // string | number | boolean 相当于 Arr[0] | Arr[1] | Arr[2]

  interface Foo {
    a: string;
    b: number;
    c: boolean;
  }
  type F1 = Foo['a'] | Foo['b'] | Foo['c'];
  type F2 = Foo['a' | 'b' | 'c']; // string | number | boolean 相当于 Foo['a'] | Foo['b'] | Foo['c'];
  ```

test3.vue

- ```vue
  <script setup lang="ts">
  type Type = 'foo' | 'bar';

  // 额外增加个Data
  interface Data {
    foo: number;
    bar: string;
  }

  type Props = {
    // T为 foo 或者 bar
    [T in Type]: {
      type: T;
      data: Data[T];
    };
    //上面的代码与下面的两个等价
    // foo:{
    //  type: 'foo',
    //  data: Data['foo']
    // },
    // bar:{
    //  type: 'bar',
    //  data: Data['bar']
    // }
  }[Type];
  defineProps<Props>();
  </script>

  <template></template>
  ```

![alt text](/images/typescript.png)

### 场景二：

我想有个 list 内部存储 Input 或者 Select，通过 type 区分，在我输入的时候有提示，不合法时有类型报错

```ts
type ComponentType = 'input' | 'select';

interface Input {
  placeholder: string;
  value: string;
}

interface Option {
  label: string;
  value: string;
}
interface Select {
  placeholder: string;
  value: string;
  options: Option[];
}
```

思路一：
我们最容易想到的就是直接 Input 和 Select 的联合类型即可如下

```ts
interface Component {
  type: ComponentType;
  props: Input | Select;
}

type List = Component[];
```

这样真的符合预期吗？
![alt text](/images/typescript2.png)
可以看到我的 type 为 select 的组件没有传递必传参数 options 仍然没有报错
故该方案不可行

方案二

```ts
interface Components {
  Select: Select;
  Input: Input;
}

type Component = {
  [T in ComponentType]: {
    type: T;
    props: Components[Capitalize<T>];
  };
}[ComponentType];
```

![alt text](/images/typescript3.png)
