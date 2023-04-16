import { deepCopy } from '../algorithm/others';
describe('深拷贝', () => {
  it('深拷贝对象', () => {
    const foo = {
      a: {
        b: '小黄',
        c: 1,
      },
      e: '汪汪',
    };
    expect(deepCopy(foo).a).not.toBe(foo.a);
  });
  it('深拷贝数组', () => {
    const foo = {
      d: [1, 2, 3, 4, 5],
      e: '汪汪',
    };
    expect(deepCopy(foo).d).not.toBe(foo.d);
  });

  it('深拷贝循环引用', () => {
    const foo: any = {
      d: [1, 2, 3, 4, 5],
      e: '汪汪',
    };
    foo.foo = foo;
    const copyFoo = deepCopy(foo);
    expect(copyFoo.foo).toStrictEqual(copyFoo);
  });
});
