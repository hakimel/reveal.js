### Concepts: mutations

Committing a mutation is the only way to actually change state in a Vuex store.

Creation

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state, payload=1) {
      state.count += payload;
    }
  }
});
```

<small>https://vuex.vuejs.org/guide/mutations.html</small>

<aside class="notes">
</aside>
