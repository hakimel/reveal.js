#### Example app

Main component, `methods`

```js
export default {
  // ...
  methods: {  // component's actions/mutations
    handleExtract() {
      const index = Math.floor(
          Math.random() * this.availableNumbers.length);
      const extracted = this.availableNumbers
                          .splice(index, 1);
      this.extractedNumbers = this.extractedNumbers
                                .concat(extracted);
    },
  },
};
```

<aside class="notes">
</aside>
