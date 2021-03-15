#### Store tests

Mutations

```js
import { mutations } from '@/store';

const { defaultState, extractNumber } = mutations;

test('ascendingExtractedNumbers', () => {
  jest.spyOn(global.Math, 'random')
    .mockReturnValueOnce(0.123456789)
    .mockReturnValueOnce(0.987654321);
  const state = { ...defaultState };
  expect(state.availableNumbers).toHaveLength(90);
  // ...
```

<aside class="notes">
</aside>
