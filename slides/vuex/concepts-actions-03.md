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
A real world example could be this one, calling an external API service.

We commit the start of the request, eventually changing the state, setting to "true"
the flag for the loading spinner for example.

Then we wait the API results and commit the success or the failure of our call,
setting in the mutations our results or our error.

Please note "context" as first parameter of an action.
What is this?
</aside>
