// @ts-nocheck
import '../algorithm/thisBind.ts';

const obj = {
  name: '张三',
};
function sayHello(...args) {
  console.log(args);
  return this.name;
}

it('myApply', () => {
  expect(sayHello.myApply(obj, [1, 2, 3])).toBe(obj.name);
});

it('myCall', () => {
  expect(sayHello.myCall(obj, 4)).toBe(obj.name);
});

it('myBind', () => {
  const curSayHello = sayHello.myBind(obj);
  expect(curSayHello(5, 6)).toBe(obj.name);
});
