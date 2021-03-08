#### Example app

Main component, `computed`

```js
export default {
  // ...
  computed: {  // component's getters
    ascendingExtractedNumbers() {
      return [...this.extractedNumbers].sort((a, b) => a - b);
    },
  },
  // ...
};
```

<aside class="notes">
</aside>
