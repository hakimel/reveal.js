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
I'm calling the mutation, passing the state object here and expecting that
after the call the state is changed in my desired way.

I'm adding another call to be sure everything works as expected, then we can restore
our random mock and finish this test.
</aside>
