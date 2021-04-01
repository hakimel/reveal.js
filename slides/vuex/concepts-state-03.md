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
mapState allows us to map the store state with a simple sintax,
we can use whatever we want,

an arrow function calling the state (count),

a string mapping the local computed property name (countAlias),

or a function for using a local state variable before returning the value.
</aside>
