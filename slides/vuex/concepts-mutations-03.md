### Concepts: mutations

`mapMutations` usage

```js
import { mapMutations } from 'vuex';

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment'
    ]),
    ...mapMutations({
      add: 'increment'
    })
  }
};
```

<small>https://vuex.vuejs.org/guide/mutations.html</small>

<aside class="notes">
</aside>
