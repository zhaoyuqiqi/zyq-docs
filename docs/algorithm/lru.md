# LRU 缓存

## 简介

- LRU 是 Least Recently Used 的缩写，即最近最少使用，是一种常用的页面置换算法，选择最近最久未使用的页面予以淘汰。该算法赋予每个页面一个访问字段，用来记录一个页面自上次被访问以来所经历的时间 t，当须淘汰一个页面时，选择现有页面中其 t 值最大的，即最近最少使用的页面予以淘汰。

## 框架使用场景

- 我们可以使用该方案来对某些可能频繁使用的内容进行缓存。在 Vue 的 Keep_alive 组件即采用了该缓存手段。

## 工作使用场景

- 我们平时的工作中也有使用的场景，笔者曾经有个需求是一个列表页的查看证书并可以保存，在再采用 LRU 缓存之前证书平均打开时间在 1s 左右，经过 LRU 算法缓存优化后，证书打开时间真正做到了秒开，省略了证书创建的过程大大优化了用户体验。 #接下来我们看下怎么实现 LRU 缓存

## 算法实现

```ts
class LRUCache {
  /**
   * 初始化一个cache
   */
  private cache = new Map();
  constructor(private capacity: number) {}
  /**
   * 缓存的取
   */
  get(key: number): number {
    // 当取的key不存在时返回 -1
    if (!this.cache.has(key)) return -1;
    // 如果取的key存在那么就删除原来key的位置，
    // 在最新的位置重新存一下
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  /**
   * 缓存的存
   */
  put(key: number, value: number): void {
    // 如果缓存中存在当前key那么就删除这个key 然后再存
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 这里是缓存中不存在当前key 并且超出最大缓存条数那么就删除第一个key
      // map的keys方法有序的返回存进去的所有的key，是一个迭代器
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    // 上述两个都未命中时则表示是新的key且没有超过最大缓存条数直接存即可
    this.cache.set(key, value);
  }
}
```
