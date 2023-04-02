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
    console.log(target);
    console.log(key);
    // 订阅操作
    return Reflect.get(target, key);
  },
});

console.log(p.name);
