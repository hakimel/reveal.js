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
Now we have a computed value returning the extracted numbers sorted by value.
Please remember we are calling this section "component's getters",
we are getting values that depends on the component's state.
</aside>
