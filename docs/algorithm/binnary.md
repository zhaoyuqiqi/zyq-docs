# 二分法

## 二分法的使用前提

二分法的效率非常高是 log 级别的，但是二分法的使用是有前提条件的：它要求我们的列表整体有序！
该思想也可以用在双指针中，即当我们所操作的数比较复杂时，我们可以使用先排序后二分或者后双指针的思路去进行求解。

## 二分法的使用场景

### 搜索

```ts
function binnarySearch(arr: number[], num: number) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (arr[mid] === num) {
      return mid;
    } else if (arr[mid] < num) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}
```
