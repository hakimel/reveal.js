### Concepts: getters

`mapGetters` advanced usage

```js
computed: {
  ...mapState(['count']),
  ...mapGetters(['countIsEven']),

  localComputed () { /* ... */ }
}
```

<small>https://vuex.vuejs.org/guide/getters.html</small>

<aside class="notes">
Same thing for the advanced usage, using spread operators for adding other computed values.
</aside>
