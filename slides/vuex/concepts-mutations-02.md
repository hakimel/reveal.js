### Concepts: mutations

Basic usage

```js
methods: {
  increment (value) {
    return this.$store.commit('increment', value);
  }
}
```

<small>https://vuex.vuejs.org/guide/mutations.html</small>

<aside class="notes">
Now we can call a mutation using $store.commit, passing the mutation name (mandatory)
and an optional payload.

Please note that we should map mutations inside the methods section of the component.
</aside>
