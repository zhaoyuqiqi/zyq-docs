import { shuffle } from "lodash";

function bubbleSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] > arr[i]) {
        [arr[j], arr[i]] = [arr[i], arr[j]];
      }
    }
  }
  return arr;
}

function selectSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    [arr[min], arr[i]] = [arr[i], arr[min]];
  }
  return arr;
}

function insertSort(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    let j = i - 1;
    while (j >= 0 && arr[j + 1] < arr[j]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      j -= 1;
    }
  }
  return arr;
}

function shellSort(arr: number[]) {
  // 希尔排序是插入排序的变种，增加了gap间隔，从插入排序的1变为了数组长度的二分
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
// 合并两个有序数组
function merge(left: number[], right: number[]) {
  const tmp: number[] = [];
  while (left.length && right.length) {
    tmp.push(left[0] < right[0] ? left.shift()! : right.shift()!);
  }
  // 遍历到这个位置有可能左边空了也有可能右边空了,将剩下的放置在后面即可
  return [...tmp, ...left, ...right];
}
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  // 二分法进行分隔
  const mid = arr.length >> 1;
  // 分隔为左半部分和右半部分分别是有序数组
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function sift(arr: number[], low: number, high: number) {
  let i = low;
  let j = 2 * i + 1;
  const tmp = arr[i];
  while (j <= high) {
    if (j + 1 <= high && arr[j + 1] > arr[j]) {
      j = j + 1;
    }
    if (arr[j] > tmp) {
      [arr[j], arr[i]] = [arr[i], arr[j]];
      i = j;
      j = 2 * i + 1;
    } else {
      break;
    }
  }
  arr[i] = tmp;
}

function heapSort(arr: number[]) {
  const high = arr.length - 1;
  for (let i = (high - 1) >> 1; i >= 0; i--) {
    sift(arr, i, high);
  }
  for (let j = high; j >= 0; j--) {
    [arr[j], arr[0]] = [arr[0], arr[j]];
    sift(arr, 0, j - 1);
  }
  return arr;
}
// let testArr: number[] = [];
// for (let i = 0; i < 10; i++) {
//   testArr.push(i);
// }
// testArr = shuffle(testArr);
// console.log(heapSort(testArr));
export {
  bubbleSort,
  selectSort,
  insertSort,
  shellSort,
  quickSort,
  mergeSort,
  heapSort,
};
