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
Oh, there is a mapMutation helper for mapping mutations in an easier way.
We can use it with array of values, or with an object with aliases.

The object spread operator works here too.
</aside>
