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
For now we have only seen how to read from the store, but what if we want to mutate it?

We have to create a mutation, a function for changing the state based on an optional payload.
In this example the payload is the value for incrementing the store,
but we have a default value of 1 if the mutation is called without parameters,
or we can pass an object for handling multiple parameters.
</aside>
