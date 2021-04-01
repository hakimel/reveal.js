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
Same for the computed value, we move it in a getter with the same name.
</aside>
