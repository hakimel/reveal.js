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
</aside>
