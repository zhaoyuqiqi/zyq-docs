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

doSomething(getLoadImagesTasks(urls), 2).then(() => console.log('全部结束了'));
