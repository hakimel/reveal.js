#### Store tests

Mutations

```js
  // ...
  extractNumber(state);
  expect(state.availableNumbers).toHaveLength(89);
  expect(state.extractedNumbers).toEqual([12]);

  extractNumber(state);
  expect(state.availableNumbers).toHaveLength(88);
  expect(state.extractedNumbers).toEqual([12, 89]);

  jest.spyOn(global.Math, 'random').mockRestore();
});
```

<aside class="notes">
</aside>
