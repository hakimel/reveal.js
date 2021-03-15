#### Store tests

Getters

```js
import { getters } from '@/store';

const { ascendingExtractedNumbers } = getters;

test('ascendingExtractedNumbers', () => {
  expect(
    ascendingExtractedNumbers({
      extractedNumbers: [12, 56, 34]
    })
  ).toEqual([12, 34, 56]);
});

```

<aside class="notes">
</aside>
