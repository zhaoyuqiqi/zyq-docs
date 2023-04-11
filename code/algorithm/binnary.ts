export function binnarySearch(arr: number[], num: number) {
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

function lengthOfLIS(arr: number[]) {
  const res = [0]; // 存储的是arr的索引
  const p = arr.slice(); // p中存储的是在res中比当前值小的前一个位子的arr数组的索引
  for (let i = 0; i < arr.length; i++) {
    const lastNumIndex = res[res.length - 1];
    if (arr[i] > arr[lastNumIndex]) {
      p[i] = lastNumIndex;
      res.push(i);
      continue;
    }
    let left = 0;
    let right = res.length - 1;
    while (left < right) {
      const mid = left + ((right - left) >> 1);
      if (arr[res[mid]] < arr[i]) {
        left = mid + 1;
      } else {
        right = mid;
      }
      if (arr[res[left]] > arr[i]) {
        if (left > 0) {
          p[i] = res[left - 1];
        }
        res[left] = i;
      }
    }
  }
  let u = res.length;
  let v = res[u - 1];
  while (u--) {
    res[u] = v;
    v = p[v];
  }
  return res;
}
