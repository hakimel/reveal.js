### Concepts: state

Creation

```js
new Vuex.Store({
  state: {
    count: 0
  },
  // ...
});
```

<small>https://vuex.vuejs.org/guide/state.html</small>

<aside class="notes">
Let's deep dive into Vuex core concepts.

Vuex uses a single state tree, a "single source of truth" for our application.
A single state tree makes it straightforward to locate a specific piece of state,
and allows us to easily take snapshots of the current app state for debugging purposes.

You can also split the state in sub-modules if you want, but this talk uses the basic root state.

Creating a default state is simple, all you have to do is define the state in the related property.
</aside>
