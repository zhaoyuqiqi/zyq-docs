// @ts-nocheck
Function.prototype.myApply = function (context: any, args) {
  if (typeof this !== 'function') {
    throw TypeError('xxxxx');
  }
  context = context || window;
  context.fn = this;
  let res;
  res = context.fn(...args);
  delete context.fn;
  return res;
};

Function.prototype.myCall = function (context: any, args) {
  if (typeof this !== 'function') {
    throw TypeError('xxxxx');
  }
  context = context || window;
  context.fn = this;
  let res;
  res = context.fn(args);
  delete context.fn;
  return res;
};

Function.prototype.myBind = function (context: any) {
  context = context || window;
  const fn = this;
  return function (...args) {
    return fn.myApply(context, args);
  };
};

const obj = {
  [Symbol.iterator]() {
    return {
      next() {
        return {
          value: 'xxx',
          done: false,
        };
      },
    };
  },
};

const arr1 = [
  { id: 1, pid: 0, title: 'html' },
  { id: 2, pid: 1, title: 'body' },
  { id: 3, pid: 2, title: 'div' },
  { id: 4, pid: 2, title: 'div' },
  { id: 5, pid: 3, title: 'a' },
  { id: 6, pid: 3, title: 'a' },
  { id: 7, pid: 5, title: 'span' },
];

function arr2tree(arr, id = null) {
  const tree = [];
  for (const el of arr) {
    if (el.pid === id) {
      const children = arr2tree(arr, el.id);
      if (children.length) {
        el.children = children;
      }
      tree.push(el);
    }
  }
  return tree;
}

const arr2 = [
  {
    id: 1,
    pid: 0,
    title: 'html',
    children: [
      {
        id: 2,
        pid: 1,
        title: 'body',
        children: [
          {
            id: 3,
            pid: 2,
            title: 'div',
            children: [
              {
                id: 5,
                pid: 3,
                title: 'a',
                children: [{ id: 7, pid: 5, title: 'span' }],
              },
              { id: 6, pid: 3, title: 'a', children: [] },
            ],
          },
          { id: 4, pid: 2, title: 'div' },
        ],
      },
    ],
  },
];

function buildTree(arr, parentId = null) {
  const tree = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].parentId === parentId) {
      const children = buildTree(arr, arr[i].id);
      if (children.length) {
        arr[i].children = children;
      }
      tree.push(arr[i]);
    }
  }

  return tree;
}
