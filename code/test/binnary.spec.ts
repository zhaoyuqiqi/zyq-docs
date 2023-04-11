import { binnarySearch } from '../algorithm/binnary';

describe('二分', () => {
  it('二分搜索', () => {
    expect(binnarySearch([0, 1, 2, 3, 4, 5, 6, 7], 0)).toBe(0);
    expect(binnarySearch([0, 1, 2, 3, 4, 5, 6, 7], 7)).toBe(7);
    expect(binnarySearch([0, 1, 2, 3, 4, 5, 6, 7], 3)).toBe(3);
    expect(binnarySearch([0, 1, 2, 3, 4, 5, 6, 7], 9)).toBe(-1);
  });
});
