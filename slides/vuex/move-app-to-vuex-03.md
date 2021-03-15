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
</aside>
