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
Mutations are basically functions changing the state passed by parameter.
In this example we import the default state, avoiding to mock it,
but often you can simply mock the state with your desired properties and pass it
in the mutation state parameter.

Here we are mocking the random function as we did before, in order to have
not-so-random value in testing.
Then we create the state starting from the default one.
No special need for that, but I prefer to be safe than sorry and I check that
we have ninety available numbers in the state.
</aside>
