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
The final section of our main component contains the handleExtract function,
used to extract a random number from the list of available numbers,
removing it from the list of available numbers and adding it to the list of extracted numbers.

We can say that calling this function we are "mutating" the component's state
with an action.

I'm using this terms in order to have a clear vision, later on, on how to enter in the mindset of Vuex.
</aside>
