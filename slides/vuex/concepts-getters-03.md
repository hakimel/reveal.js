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
</aside>
