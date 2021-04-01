### Configure Vuex

Enabling `this.$store` inside Vue components

```js
// src/main.js

// ...
import store from './store';

new Vue({
  store,  // same as `store: store`
  // ...
});
```

<small>https://vuex.vuejs.org/guide/</small>

<aside class="notes">
After that you can import the store and pass it inside the start function of your Vue app,
enabling the use of "this.$store" inside every other component.
</aside>
