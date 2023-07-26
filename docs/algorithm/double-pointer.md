# 双指针

双指针多用在二分算法中或是快慢指针中，在 leetcode 中有以下题目：

## 移动零

给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

请注意 ，必须在不复制数组的情况下原地对数组进行操作。

示例 1:

输入: `nums = [0,1,0,3,12]`

输出: `[1,3,12,0,0]`
示例 2:

输入: nums = [0]
输出: [0]

提示:

1 <= nums.length <= 10^4

-2^31 <= nums[i] <= 2^31 - 1

进阶：你能尽量减少完成的操作次数吗？

- 我们思路如下：
  - 我们声明两个快慢指针 `slow` 和 `fast`，他们刚开始都从 0 开始，当快指针位置的值不为 0 的时候那么我们交换快慢指针位置的值，快指针每次循环都自增，慢指针只有当交换值的时候才自增，如果值一直为 0，那么快指针一直自增，慢指针不动，指到快指针的位置不为 0 就将慢指针处的值交换到快指针的位置。
- 代码如下：

```ts
const moveZeroes = function (nums) {
  let slow = (fast = 0);
  for (let i = 0; i < nums.length; i++) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
    fast++;
  }
};
```

## 三数之和

给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请

你返回所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。
示例 1：

输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
解释：
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
注意，输出的顺序和三元组的顺序并不重要。
示例 2：

输入：nums = [0,1,1]
输出：[]
解释：唯一可能的三元组和不为 0 。
示例 3：

输入：nums = [0,0,0]
输出：[[0,0,0]]
解释：唯一可能的三元组和为 0 。

提示：

3 <= nums.length <= 3000
-10^5 <= nums[i] <= 10^5

- 我们的思路如下：
  1. 首先三个数求和我们可以使用三层循环进行暴力求解，这样是一定可以求解出我们的答案的，但是这样子的时间复杂度就是 O(n^3)，效率相对较低，那么我们有没有效率更高一些的方法呢？是有的，我们看第二种思路。
  2. 三个数求和，我们可以使用双指针，如果是无序的数组的话我们只能暴力求解，我们可以先对数组进行排序，假设数组长度为`n`，那么我们最外层循环从下标`0`开始遍历，一直到小于下标`n-2`，我们设定左右两个指针 left 和 right，其中左指针 left 的初始值为外层循环的索引+1，也就是外层循环的下一个数，右指针 right 为最后一个索引也就是`n-1`，接下来开始一个 while(left < right)循环，当外层循环的索引位置的值与左指针加右指针的值等于 0 时（题目所求），那么我们将这三个数添加的结果中，然后我们的左指针右移（左指针位置的数变大），右指针左移（右指针位置的数变小），然后数组中可能有重复数字，题目要求不能重复，所以我们要进行去重，去重思路为当左指针小于右指针时，右指针的值如果等于右指针+1 位置的值，那么我们就让右指针继续自减，指到右指针不再等于右指针+1 位置的值；左指针也是类似，当左指针小于右指针，并且左指针位置的值等于左指针-1 位置的值那么就让左指针自增，这样我们就做到了三数之和中第二个跟第三个数的去重，第一个数的去重我们可以放在第一层循环内部，当当前索引位置的值等于当前索引-1 位置的值的时候，那么我们就直接退出本次循环即可。因为我们的数组时经过排序之后的有序数组，那么当我们的第一个数超过我们要求的值时直接跳出所有循环即可，或者直接返回收集的结果。
- 代码实现如下：

```ts
function threeSum(nums: number[]): number[][] {
  const res: number[][] = []; // 收集结果的数组
  nums.sort((a, b) => a - b); // 将数组变为有序数组
  const len = nums.length; // 缓存当前数组长度
  for (let i = 0; i < len - 2; i++) {
    // 因为是有序数组，所以当我们第一个数大于0时，那么我们直接返回结果即可
    if (nums[i] > 0) return res;
    // 当不为0时，后面的如果与前一个相等那么就代表是重复的直接continue即可；
    if (i !== 0 && nums[i] === nums[i - 1]) continue;
    // 左指针为第一个数的位置的后一位
    let left = i + 1;
    // 右指针为最后一位
    let right = len - 1;
    while (left < right) {
      // 求解当前的三数之和
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        // 如果三数之和为0，那么我们需要进行结果收集
        res.push([nums[i], nums[left], nums[right]]);
        // 左右指针分别自增和自减
        left++;
        right--;
        // 左右指针分别去重
        while (left < right && nums[left] === nums[left - 1]) {
          left++;
        }
        while (left < right && nums[right] === nums[right + 1]) {
          right--;
        }
      } else if (sum > 0) {
        // 如果当前的三数之和大于0，那么代表当前右指针太大了
        right--;
      } else {
        // 如果小于0那么代表当前左指针太小了
        left++;
      }
    }
  }
  // 最后返回收集的结果
  return res;
}
```

## 合并区间

以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

示例 1：

输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
输出：[[1,6],[8,10],[15,18]]
解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
示例 2：

输入：intervals = [[1,4],[4,5]]
输出：[[1,5]]
解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。

提示：

1 <= intervals.length <= 10^4
intervals[i].length == 2
0 <= starti <= endi <= 10^4

- 我们的思路如下：
  1. 既然是合并两个区间，那么我可以先对区间左侧的元素进行排序，得到一个以单个区间左侧元素递增的二维数组，然后我们遍历这个数组，定义两个指针，`left`和`right`，当当前元素的左侧小于等于我们之前区间的右侧值那么就可以合并这两个区间，其区间就是`[left,Math.max(cur.left,right)]`,否则就是不可合并区间，我们直接将`[left,right]`也就是上一次的区间放入结果数组中即可；
  2. 第二种方法也是先进行排序，然后当结果数组为空时直接将第一个区间加入结果数组，当当前元素的左侧大于结果数组最后一个区间的右侧时此时是不可合并的，直接放入结果数组即可，否则就是可合并的，合并时需要更新结果数组的最后一项的右侧区间即可。
- 代码实现如下：

1. 方法一使用双指针记录

```ts
function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const res: number[][] = [];
  // 当前左指针
  let leftVal = intervals[0][0];
  // 当前右指针
  let rightVal = intervals[0][1];
  for (let i = 1; i < intervals.length; i++) {
    const cur = intervals[i];
    // 可合并
    if (cur[0] <= rightVal) {
      rightVal = Math.max(cur[1], rightVal);
    } else {
      // 不可合并时直接添加上一个进去
      res.push([leftVal, rightVal]);
      leftVal = cur[0];
      rightVal = cur[1];
    }
  }
  // 把最后一次的值添加进去即可
  res.push([leftVal, rightVal]);
  return res;
}
```

2. 方法二使用结果数组中最后一个值记录

```ts
function merge(intervals: number[][]): number[][] {
  const res: number[][] = [];
  // 排序
  intervals.sort((a, b) => a[0] - b[0]);
  for (const item of intervals) {
    const resultLastValueOfRight = res[res.length - 1][1];
    // 如果当前结果为空（添加首次第一个区间）或者当前值的左区间大于结果数组中的最后一个值的区间右侧的值就表示不可合并直接添加进去即可
    if (!res.length || item[0] > resultLastValueOfRight) {
      res.push(item);
    } else {
      // 这里就是可合并的
      // 更新结果数组中的最后一个值的右侧区间的值即可
      resultLastValueOfRight = Math.max(item[1], resultLastValueOfRight);
    }
  }
  return res;
}
```
