### Concepts: state

`mapState` usage

```js
import { mapState } from 'vuex';

export default {
  // ...
  computed: mapState({
    count: state => state.count,
    countAlias: 'count',
    // to access local state with `this`
    countPlusLocalState (state) {
      return state.count + this.localCount;
    }
  })
};
```

<small>https://vuex.vuejs.org/guide/state.html</small>

<aside class="notes">
</aside>
