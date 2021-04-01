### Mutations Must Be Synchronous

Why? Because we need to have a "before" and "after" snapshots of the state.

If we introduce a callback inside a mutation, it makes that impossible.<br>The callback is not called yet when the mutation is committed, and there's no way to know when the callback will actually be called. Any state mutation performed in the callback is essentially un-trackable!

<small>https://vuex.vuejs.org/guide/mutations.html</small>

<aside class="notes">
Just a final note, mutations must be synchronous!

Why? Because we need to have a "before" and an "after" snapshot of the state.

We can't introduce a callback inside a mutation, it will make that impossible.
When the mutation is committed the callback is not called yet, the same for
a promise, that is not resolved yet
and there is no way to know when the callback will actually be called or the promise resolved.
Any state mutation performed in the callback or in the resolve/reject is
essentially untrackable.

You need to call an API or trigger a callback?
You can use actions instead of mutations!
</aside>
