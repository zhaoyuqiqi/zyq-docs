import { arr2tree } from '../algorithm/others';

it('arr2tree', () => {
  const arr1 = [
    { id: 1, pid: 0, title: 'html' },
    { id: 2, pid: 1, title: 'body' },
    { id: 3, pid: 2, title: 'div' },
    { id: 4, pid: 2, title: 'div' },
    { id: 5, pid: 3, title: 'a' },
    { id: 6, pid: 3, title: 'a' },
    { id: 7, pid: 5, title: 'span' },
  ];
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
                  children: [{ id: 7, pid: 5, title: 'span', children: [] }],
                },
                { id: 6, pid: 3, title: 'a', children: [] },
              ],
            },
            { id: 4, pid: 2, title: 'div', children: [] },
          ],
        },
      ],
    },
  ];
  expect(arr2tree(arr1)).toEqual(arr2);
});
