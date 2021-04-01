#### Example app

Main component, `data()`

```js
export default {
  name: 'Home',
  data() {  // component's state
    return {
      availableNumbers: [...Array(90).keys()]
                            .map((i) => i + 1),
      extractedNumbers: [],
    };
  },
  // ...
};
```

<aside class="notes">
This is the main component data function, containing the component's state.
As you can see we initialize two list, the first with the numbers from one to ninety,
the second is the array containing the extracted numbers, empty when the app starts.
</aside>
