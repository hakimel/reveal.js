### Concepts: getters

`mapGetters` usage

```js
import { mapGetters } from 'vuex';

export default {
  // ...
  computed: mapGetters({
    countIsEven: state => state.countIsEven,
    countIsEvenAlias: 'countIsEven'
  })
};
```

<small>https://vuex.vuejs.org/guide/getters.html</small>

<aside class="notes">
You have also mapGetters, that works the same as the mapState we saw before.
</aside>
