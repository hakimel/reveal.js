### Mutations Must Be Synchronous

Why? Because we need to have a "before" and "after" snapshots of the state.

If we introduce a callback inside a mutation, it makes that impossible.<br>The callback is not called yet when the mutation is committed, and there's no way to know when the callback will actually be called. Any state mutation performed in the callback is essentially un-trackable!

<small>https://vuex.vuejs.org/guide/mutations.html</small>

<aside class="notes">
</aside>
