### Example app

Creating the store, composing

```js
// src/store/index.js

export default new Vuex.Store({
  state: defaultState,
  getters,
  mutations,
});
```

<aside class="notes">
Now we can finally compose the store using the values we created before,
passing them to the store creation.
</aside>
