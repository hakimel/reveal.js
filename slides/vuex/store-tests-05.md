#### Store tests

Actions

Keep in mind this sample action

```js
// export const actions = {
  async getRecords (context) {
    context.commit('getRecordsRequest');
    try {
      const results = await axios.get('/api/records/');
      context.commit('getRecordsSuccess', results.data);
    } catch (error) {
      context.commit('getRecordsFailure', error);
    }
  }
// };
```

<aside class="notes">
Now, we don't have a real action, but we can keep in mind this example,
committing the start of a request, making the request and committing success
or failure based on the response we obtain.
</aside>
