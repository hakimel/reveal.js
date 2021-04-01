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
After officially moving all our logic to the store, we need to test that
everything is working as expected.

As I said before, exporting every single section of the store allows us to easily
import that section in our tests.

This way we can test, for example, the default state, expecting it to be equal to this one.
If we add something to the default state, we need to update this test accordingly.
</aside>
