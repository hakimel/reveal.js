#### Store tests

Default state

```js
import { defaultState } from '@/store';

test('should have the default state', () => {
  expect(defaultState).toEqual({
    availableNumbers: [...Array(90).keys()].map((i) => i + 1),
    extractedNumbers: [],
  });
});

```

<aside class="notes">
</aside>
