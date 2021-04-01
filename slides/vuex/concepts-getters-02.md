### Concepts: getters

Basic usage

```html
<div>
  {{ $store.getters.countIsEven }}
  {{ countIsEven }}
</div>
```

```js
computed: {
  countIsEven () {
    return this.$store.getters.countIsEven;
  }
}
```

<small>https://vuex.vuejs.org/guide/getters.html</small>

<aside class="notes">
You can access getters like you access a state property,
but using $store.getters instead of $store.state
</aside>
