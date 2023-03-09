import { shuffle } from "lodash";
import {
  bubbleSort,
  selectSort,
  insertSort,
  shellSort,
  quickSort,
  mergeSort,
  heapSort,
} from "../algorithm/sort";

let testArr: number[] = [];
for (let i = 0; i < 1000; i++) {
  testArr.push(i);
}
testArr = shuffle(testArr);
const resultArr = testArr.slice().sort((a, b) => a - b);
describe("排序算法", () => {
  it("冒泡排序", () => {
    expect(
      bubbleSort(testArr.slice()).every(
        (item, index) => item === resultArr[index]
      )
    ).toBe(true);
  });
  it("选择排序", () => {
    expect(
      selectSort(testArr.slice()).every(
        (item, index) => item === resultArr[index]
      )
    ).toBe(true);
  });
  it("插入排序", () => {
    expect(
      insertSort(testArr.slice()).every(
        (item, index) => item === resultArr[index]
      )
    ).toBe(true);
  });
  it("希尔排序", () => {
    expect(
      shellSort(testArr.slice()).every(
        (item, index) => item === resultArr[index]
      )
    ).toBe(true);
  });
  it("快速排序", () => {
    expect(
      quickSort(testArr.slice(), 0, testArr.length - 1).every(
        (item, index) => item === resultArr[index]
      )
    ).toBe(true);
  });
  it("归并排序", () => {
    expect(
      mergeSort(testArr.slice()).every(
        (item, index) => item === resultArr[index]
      )
    ).toBe(true);
  });
  it("堆排序", () => {
    expect(
      heapSort(testArr.slice()).every(
        (item, index) => item === resultArr[index]
      )
    ).toBe(true);
  });
});
