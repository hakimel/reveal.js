### Concepts: actions

API call example

```js
const store = new Vuex.Store({
  actions: {
    async getRecords (context) {
      context.commit('getRecordsRequest');
      try {
        const results = await axios.get('/api/records/');
        context.commit('getRecordsSuccess', results.data);
      } catch (error) {
        context.commit('getRecordsFailure', error);
      }
    }
  }
});
```

<small>https://vuex.vuejs.org/guide/actions.html</small>

<aside class="notes">
</aside>
