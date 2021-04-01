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
Getters are like computed values for a Vuex store, they are defined as functions
using the state and returning a value.
Every time the state used in a getter changes, the getter is re-computed.

In this example, every time the count changes, countIsEven is updated too.
</aside>
