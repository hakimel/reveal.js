### Concepts: actions

Creation

```js
const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment (state, payload=1) {
      state.count += payload;
    }
  },
  actions: {
    incrementAsync (context, payload) {
      setTimeout(() => {
        context.commit('increment', payload);
      }, 1000);
    }
  }
});
```

<small>https://vuex.vuejs.org/guide/actions.html</small>

<aside class="notes">
</aside>
