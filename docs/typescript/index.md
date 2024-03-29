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
  type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer S ? S : never;
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
