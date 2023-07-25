async function doSomething(tasks: (() => Promise<void>)[], limit = 2) {
  const pool = new Set();
  for (const task of tasks) {
    const promise = task();
    pool.add(promise);
    promise.then(() => pool.delete(promise));
    if (pool.size >= limit) {
      await Promise.race(pool);
    }
  }
  return Promise.all(pool);
}

const sleep = (timeout: number, taskName: string) => {
  return new Promise<void>(resolve => {
    console.log(`${taskName}start`);
    setTimeout(() => {
      console.log(`${taskName}end`);
      resolve();
    }, timeout);
  });
};

const tasks = [
  () => sleep(1000, '吃饭'),
  () => sleep(1000, '打游戏'),
  () => sleep(3000, '写代码'),
  () => sleep(5000, '睡觉'),
  () => sleep(7000, '锻炼身体'),
];

// doSomething(tasks, 4).then(() => console.log('全部结束了'));

function getLoadImagesTasks(urls: string[]) {
  const tasks: (() => Promise<void>)[] = [];
  urls.forEach(url => {
    tasks.push(
      () =>
        new Promise<void>(resolve => {
          const img = new Image();
          console.log(url + 'start');
          img.onload = () => {
            console.log(url + 'end');
            resolve();
          };
          img.src = url;
          // error 场景暂不考虑
        })
    );
  });
  return tasks;
}

const urls = [
  'https://www.kkkk1000.com/images/getImgData/getImgDatadata.jpg',
  'https://www.kkkk1000.com/images/getImgData/gray.gif',
  'https://www.kkkk1000.com/images/getImgData/Particle.gif',
  'https://www.kkkk1000.com/images/getImgData/arithmetic.png',
  'https://www.kkkk1000.com/images/getImgData/arithmetic2.gif',
  'https://www.kkkk1000.com/images/getImgData/getImgDataError.jpg',
  'https://www.kkkk1000.com/images/getImgData/arithmetic.gif',
  'https://www.kkkk1000.com/images/wxQrCode2.png',
];

// doSomething(getLoadImagesTasks(urls), 2).then(() => console.log('全部结束了'));

enum PromisePlusState {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}
type ThenCallback = () => void;
type PromisePlusExec<T = any> = (
  resolve: (value?: T | PromiseLike<T>) => void,
  reject: (reason: any) => void
) => void;

function isPromiseLike(obj: any): obj is { then(): any } {
  return obj && typeof obj.then === 'function';
}

class PromisePlus<T> {
  private reason?: Error;
  private value?: any;
  private state: PromisePlusState;
  private onFulfilledCallback: ThenCallback[] = [];
  private onRejectCallback: ThenCallback[] = [];
  constructor(exec: PromisePlusExec<T>) {
    this.state = PromisePlusState.PENDING;
    const resolve = (value?: T | PromiseLike<T>) => {
      if (this.state === PromisePlusState.PENDING) {
        // 如果是promise或者是带有then方法的对象，就当做一个promise
        if (value instanceof PromisePlus || isPromiseLike(value)) {
          value.then(resolve, reject);
          return;
        }
        this.state = PromisePlusState.FULFILLED;
        this.value = value;
        this.onFulfilledCallback.forEach(callback => callback());
      }
    };
    const reject = (reason?: any) => {
      if (this.state === PromisePlusState.PENDING) {
        this.state = PromisePlusState.REJECTED;
        this.reason = reason;
        this.onRejectCallback.forEach(callback => callback());
      }
    };
    try {
      exec(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ) {
    const onFulfilled = typeof onfulfilled === 'function' ? onfulfilled : value => value;
    // 当没有catch捕获时继续把错误向上抛出
    const onRejected =
      typeof onrejected === 'function'
        ? onrejected
        : reason => {
            throw reason;
          };
    const newPromsie = new PromisePlus<Awaited<TResult1>>((resolve, reject) => {
      if (this.state === PromisePlusState.PENDING) {
        this.onFulfilledCallback.push(() => {
          setTimeout(() => {
            try {
              const response = onFulfilled(this.value);
              this.resolvePromise(newPromsie, response, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectCallback.push(() => {
          setTimeout(() => {
            try {
              const response = onRejected(this.reason);
              this.resolvePromise(newPromsie, response, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      } else if (this.state === PromisePlusState.FULFILLED) {
        setTimeout(() => {
          try {
            const response = onFulfilled(this.value);
            this.resolvePromise(newPromsie, response, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else {
        setTimeout(() => {
          try {
            const response = onRejected(this.reason);
            this.resolvePromise(newPromsie, response, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
    return newPromsie;
  }
  catch(onrejected?: ((reason: any) => any) | undefined | null) {
    return this.then(null, onrejected);
  }
  finally(callback: () => void) {
    return this.then(
      value => {
        return PromisePlus.resolve().then(() => {
          callback();
          return value;
        });
      },
      reason => {
        return PromisePlus.resolve().then(() => {
          callback();
          throw new Error(reason);
        });
      }
    );
  }
  /**
   *
   * @param curPromise then方法返回值的promise实例
   * @param onfulfilledValue then方法中用户传入函数的返回值
   * @param resolve
   * @param reject
   */
  private resolvePromise(curPromise, onfulfilledValue, resolve, reject) {
    // 如果用户函数的返回值与当前的返回值实例是一个那么就抛出异常
    if (curPromise === onfulfilledValue) {
      reject(new TypeError('Chaining cycle detected for promise'));
    }
    try {
      // 如果是promise或者是一个类Promise那么就在这个promise的then执行的时候来触发我们当前的resolve
      if (onfulfilledValue instanceof PromisePlus || isPromiseLike(onfulfilledValue)) {
        onfulfilledValue.then(resolve, reject);
      } else {
        // 普通元素直接resolve
        resolve(onfulfilledValue);
      }
    } catch (error) {
      reject(error);
    }
  }

  static resolve<T>(value?: T) {
    return new PromisePlus<T>(async resolve => {
      resolve(value);
    }).then(val => val);
  }

  static reject<T>(reason: T) {
    return new PromisePlus<T>((_, reject) => {
      reject(reason);
    });
  }

  static all<T>(promises: (T | PromiseLike<T>)[]): PromisePlus<Awaited<T>[]> {
    let fulfilledCount = 0;
    const result: Awaited<T>[] = [];
    return new PromisePlus((resolve, reject) => {
      promises.forEach((promise, index) => {
        PromisePlus.resolve(promise).then(
          value => {
            fulfilledCount++;
            result[index] = value;
            if (fulfilledCount === promises.length) {
              resolve(result);
            }
          },
          err => {
            reject(err);
          }
        );
      });
    });
  }
}

new PromisePlus((_, reject) => {
  reject('hahahahh');
}).catch(e => {
  console.log(e);
});
