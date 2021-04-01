### Example app

Creating the store, mutations

```js
// src/store/index.js

export const mutations = {
  extractNumber(state) {
    const index = Math.floor(
        Math.random() * state.availableNumbers.length);
    const extracted = state.availableNumbers
                        .splice(index, 1);
    state.extractedNumbers = state.extractedNumbers
                               .concat(extracted);
  },
};
```

<aside class="notes">
Inside the extractNumber mutation we move the button click handler,
acting on state properties instead.
We update available numbers and extracted numbers in the state.

No need for actions this time, but we can implement them the same way we did for mutations,
creating a constant object with the actions as properties.
</aside>
