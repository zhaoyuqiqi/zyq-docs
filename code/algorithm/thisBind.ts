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
