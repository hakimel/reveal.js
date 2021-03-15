### Concepts: actions

`mapActions` usage

```js
import { mapActions } from 'vuex';

export default {
  // ...
  methods: {
    incrementAsyncLocal (value) {
        return this.$store.dispatch('incrementAsync', value)
            .then( /* ... */);
    }
    ...mapActions(['incrementAsync']),
    ...mapActions({
      addAsync: 'incrementAsync'
    })
  }
};
```

<small>https://vuex.vuejs.org/guide/actions.html</small>

<aside class="notes">
</aside>
