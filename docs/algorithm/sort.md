# 排序算法

- 主要讲述七种排序方法并深入探究其使用场景
  - 时间复杂度 O(n \* n)
    - 冒泡排序
    - 选择排序
    - 插入排序
  - 时间复杂度 O(n _ n) < 我在这里 < O(n _ logn)
    - 希尔排序
  - 时间复杂度 O(n \* logn)
    - 快速排序
    - 归并排序
    - 堆排序

## slow 三人组 O(n \* n)

### 冒泡排序

- 顾名思义，冒泡排序每次选择一个最大或者最小的元素，循环 n^2 次后每个元素都将变得有序

```typescript
function bubbleSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {、
    for (let j = 0; j < arr.length; j++) {
     // 后面的数如果比前面的数大那么就交换位置放到前面去
      if (arr[j] > arr[i]) {
        [arr[j], arr[i]] = [arr[i], arr[j]];
      }
    }
  }
  return arr;
}
```

### 选择排序

```ts
function selectSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    // 选择一个最小的指针 默认当前的指针最小
    let min = i;
    // 依次往后面查找
    for (let j = i + 1; j < arr.length; j++) {
      // 如果当前的比最小的还要小那么就把最小的索引设置为当前的索引
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    // 交换当前遍历的位置的值与最小值
    [arr[min], arr[i]] = [arr[i], arr[min]];
  }
  return arr;
}
```

### 插入排序

- 插入排序可以理解为我们摸扑克牌，其中 i 代表我们新摸到的牌，j 代表我们手里的最后一张牌

```ts
function insertSort(arr: number[]) {
  // 摸到的牌从1开始，我们手里现在有一张索引为0的牌即j
  for (let i = 1; i < arr.length; i++) {
    let j = i - 1; // 我们手里的最后一张牌索引为j
    // 当下标不越界时,并且我们新摸到的那张牌如果小于手里的最后一张牌
    while (j >= 0 && arr[j + 1] < arr[j]) {
      // 那么就进行交换位置,摸到的牌变为倒数第二张牌继续与前面的牌进行比较
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      // 手里的最后一张牌变成前一张牌
      j -= 1;
    }
  }
  // 循环完毕就是正确的顺序
  return arr;
}
```

## 五五开小王子 O(n \* (2/3) \* n)

### 希尔排序

- 希尔排序是插入排序的变种，增加了 gap 间隔，从插入排序的 1 变为了数组长度的二分

```ts
function shellSort(arr: number[]) {
  function insertSortForShell(arr: number[], gap: number) {
    for (let i = gap; i < arr.length; i++) {
      let j = i - gap;
      while (j >= 0 && arr[j + gap] < arr[j]) {
        [arr[j], arr[j + gap]] = [arr[j + gap], arr[j]];
        j -= gap;
      }
    }
    return arr;
  }
  let mid = arr.length >> 1;
  // 当长度二分之后大于0时一直循环
  while (mid) {
    insertSortForShell(arr, mid);
    mid >>= 1;
  }
  return arr;
}
```

## fast 三人组 O(n \* logn)

### 快速排序

- 快速排序是递归的算法，需要一个 partition 辅助函数进行分隔

```ts
function partition(arr: number[], left: number, right: number) {
  const tmp = arr[left];
  while (left < right) {
    // 当左指针小于右指针并且右边的值大于等于缓存的值那么右指针就一直减小
    while (left < right && arr[right] >= tmp) {
      right--;
    }
    // 跳出这个循环要么是left等于right要么就是在右边找到了一个比缓存值小的数
    // 将这个小的数交换到左边
    arr[left] = arr[right];
    // 从左边找到一个比缓存值大的数
    while (left < right && arr[left] <= tmp) {
      left++;
    }
    // 将这个数交换到右边
    arr[right] = arr[left];
  }
  // 将原来的数填到刚开始的位置
  arr[left] = tmp;
  //   最后返回left，这个值也就是中间值的位置
  return left;
}

function quickSort(arr: number[], left: number, right: number) {
  // 当左指针小于右指针的时候开始递归
  if (left < right) {
    // 获取中间值的位置
    const mid = partition(arr, left, right);
    // 递归调用组左半部分
    quickSort(arr, left, mid);
    // 递归调用组右半部分
    quickSort(arr, mid + 1, right);
  }
  return arr;
}
```

### 归并排序

- 归并排序是递归的进行分隔然后合并两个有序数组,当数组长度为时就不需要分隔了自己本身就是有序数组了

```ts
// 合并两个有序数组
function merge(left: number[], right: number[]) {
  const tmp: number[] = [];
  while (left.length && right.length) {
    tmp.push(left[0] < right[0] ? left.shift()! : right.shift()!);
  }
  // 遍历到这个位置有可能左边空了也有可能右边空了,将剩下的放置在后面即可
  return [...tmp, ...left, ...right];
}
function mergeSort(arr: number[]) {
  // 数组长度为1时本身就是有序数组;
  if (arr.length <= 1) return arr;
  // 二分法进行分隔
  const mid = arr.length >> 1;
  // 分隔为左半部分和右半部分分别是有序数组
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
```

### 堆排序

- 在学习堆排序之前需要先掌握以下内容：
  - 什么是堆？
    - 堆就是一棵完全二叉树
  - 堆怎么从子节点找父节点？
    - 找规律可得，假设子节点索引为`i`那么父节点索引就是 `(i - 1) >> 1`，即，`i - 1` 整除以 2。
  - 堆怎么从父节点找左右子节点？
    - 假设父节点索引为`i`，那么子节点左孩子就是`2 * i + 1`，自然右孩子就是`2 * i + 2`。
- B 站有我的详细讲解视频，欢迎关注一键三连！[【面试官问一亿个数据怎么取前十榜单，这种 top k 问题你只会答先排序再取前十？今天一次性教会你堆排序与 top K 原理与实现学会后直接甩面试官脸上！（一）】 ](https://www.bilibili.com/video/BV1Rb41197hh/?share_source=copy_web&vd_source=f90566f00b6f17d7dd03097988325717)

```ts
function sift(arr: number[], low: number, high: number) {
  // 设空位置为i
  let i = low;
  // j代表i的子节点中较大的那个节点的索引位置
  let j = 2 * i + 1;
  const tmp = arr[i];
  // 当j索引没有越界
  while (j <= high) {
    // j+1也没有越界，判断右孩子是否比左孩子大，如果右孩子大那么就将右孩子索引赋值给j
    // 重述：j代表的是i的两个孩子中较大的那个节点的索引
    if (j + 1 <= high && arr[j + 1] > arr[j]) {
      j = j + 1;
    }
    // 当较大位置的值大于空位置的值
    if (arr[j] > tmp) {
      // 交换空位置与较大的位置的值
      [arr[j], arr[i]] = [arr[i], arr[j]];
      //  空位置变成当前j的位置
      i = j;
      // j还是存的当前空位置的两个孩子中较大的那个，此时存的左孩子，
      // 下一次循环就会变成左右两个孩子中较大的那个位置索引
      j = 2 * i + 1;
    } else {
      // 如果较大的孩子的值小于或等于空位置的值那么就不需要进行调整直接退出
      break;
    }
  }
  // 调整结束后空位置的值就变成最初的位置的值
  arr[i] = tmp;
}

function heapSort(arr: number[]) {
  const high = arr.length - 1;
  // 构造堆  农村包围城市 -> 从最后一个非叶子节点开始挨个调整构造，一直到整个堆
  for (let i = (high - 1) >> 1; i >= 0; i--) {
    sift(arr, i, high);
  }
  // 挨个出数
  for (let j = high; j >= 0; j--) {
    // 将最后一个位置与当前堆元素进行交换因为构造的是大根堆，堆顶元素是最大的
    [arr[j], arr[0]] = [arr[0], arr[j]];
    // 交换后进行一次整个堆的调整 注意：要将堆的最后一个high位置指针向前一位
    // 让调整函数不调整刚交换下来的那个值
    sift(arr, 0, j - 1);
  }
  return arr;
}
```
