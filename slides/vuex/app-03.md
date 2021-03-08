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
</aside>
