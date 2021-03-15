### Concepts: getters

Getters are like "computed" values for a Vuex store

Creation

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    countIsEven: state => {
      return state.count % 2 === 0;
    }
  }
});
```

<small>https://vuex.vuejs.org/guide/getters.html</small>

<aside class="notes">
</aside>
