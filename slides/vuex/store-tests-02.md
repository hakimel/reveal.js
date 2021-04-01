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
Same for getters, we import only that section of the store, but keep in mind that
getters are basically functions acting on the store state and returning a value,
so we need to call them passing the state property.

In this example we call ascendingExtractedNumbers, passing the state chunk we need
(there is no need to pass the entire state, just the properties involved in the computation).
Then we expect the return value to be this one, a list of sorted numbers.
</aside>
