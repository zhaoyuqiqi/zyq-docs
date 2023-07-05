// 单例模式
class Person {
  static instance: Person;
  constructor(public name) {
    if (Person.instance) {
      return Person.instance;
    }
    Person.instance = this;
  }
  sayHello() {
    console.log(`hello ,我的名字是${this.name}`);
  }
}
// 订阅发布 => 观察者模式
class PubAndSub {
  map = new Map<string, Set<(data: any) => void>>();
  subscribe(event: string, callback: (data: any) => void) {
    if (!this.map.has(event)) {
      this.map.set(event, new Set());
    }
    const dep = this.map.get(event)!;
    dep.add(callback);
  }
  publish(event: string, data: any) {
    if (this.map.has(event)) {
      const dep = this.map.get(event)!;
      dep.forEach(callback => {
        callback(data);
      });
    }
  }
  remove(event: string, callback?: (data: any) => void) {
    if (this.map.has(event)) {
      const dep = this.map.get(event)!;
      if (callback) {
        if (dep.has(callback)) {
          dep.delete(callback);
        }
      } else {
        dep.clear();
      }
    }
  }
  removeAll() {
    this.map.clear();
  }
}

const pubAndSub = new PubAndSub();
function zhangsanCallback(time: string) {
  console.log(`${time}了，张三开始睡觉了`);
}
pubAndSub.subscribe('sleep', zhangsanCallback);
pubAndSub.subscribe('sleep', (time: string) => {
  console.log(`${time}了，李四开始睡觉了`);
});
// pubAndSub.remove('sleep', zhangsanCallback);
pubAndSub.removeAll();

setTimeout(() => {
  pubAndSub.publish('sleep', '晚上十一点');
}, 2000);

const obj = {
  name: '张三',
  age: 18,
};

const p = new Proxy(obj, {
  set(target, key, value) {
    // 发布操作
    return Reflect.set(target, key, value);
  },
  get(target, key) {
    // 订阅操作
    return Reflect.get(target, key);
  },
});

export function deepCopy(obj: any, cache = new WeakMap()) {
  if (typeof obj === 'object' && obj !== null) {
    const isArray = Array.isArray(obj);
    let temp = isArray ? [] : {};
    //map缓存中是否存在当前对象或数组
    if (cache.get(obj)) {
      //如果存在那么直接返回当前的对象或数组
      return obj;
    }
    //如果不存在那么就添加到缓存中
    cache.set(obj, temp);
    for (const key in obj) {
      //递归拷贝 将缓存区传给下一个递归
      temp[key] = deepCopy(obj[key], cache);
    }
    return temp;
  }
  //如果不是对象是个单一类型的值直接返回
  return obj;
}

export function arr2tree(arr: any[], pid = 0) {
  const tree: any[] = [];
  for (const node of arr) {
    if (node.pid === pid) {
      const children = arr2tree(arr, node.id);
      node.children = children;
      tree.push(node);
    }
  }
  return tree;
}

export function arr2tree2(arr, rootId = 0) {
  const map = {};
  const tree: any[] = [];
  for (const node of arr) {
    map[node.id] = { ...node, children: [] };
  }
  for (const cur of arr) {
    const node = map[cur.id];
    if (node.pid === rootId) {
      tree.push(node);
    } else {
      map[node.pid].children.push(node);
    }
  }
  return tree;
}
