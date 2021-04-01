### Concepts: state

`mapState` usage with other computed values

```js
computed: {
  ...mapState({
    // ...
  }),

  localComputed () { /* ... */ }
}
```


<small>https://vuex.vuejs.org/guide/state.html</small>

<aside class="notes">
You can use local computed values too, mapping the state with an object spread operator
</aside>
