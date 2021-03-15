### Concepts: state

Basic usage

```html
<div>
  {{ $store.state.count }}
  {{ count }}
</div>
```

```js
computed: {
  count () {
    return this.$store.state.count;
  }
}
```

<small>https://vuex.vuejs.org/guide/state.html</small>

<aside class="notes">
</aside>
