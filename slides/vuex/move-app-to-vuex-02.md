### Example app

Creating the store, getters

```js
// src/store/index.js

export const getters = {
  ascendingExtractedNumbers(state) {
    return [...state.extractedNumbers].sort((a, b) => a - b);
  },
};
```

<aside class="notes">
</aside>
