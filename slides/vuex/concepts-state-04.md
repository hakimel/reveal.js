### Concepts: state

`mapState` usage simplified

```js
mapState({
  count: state => state.count
})
```

is the same as

```js
mapState([
  'count'
])
```


<small>https://vuex.vuejs.org/guide/state.html</small>

<aside class="notes">
An easier approach is to use mapState passing an array of values we want to be mapped.
It will map to computed properties with the same name.
</aside>
