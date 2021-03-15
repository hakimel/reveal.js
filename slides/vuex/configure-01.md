### Configure Vuex

Creating the store

```js
// src/store/index.js

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: { /* ... */ },
  mutations: { /* ... */ },
});
```

<small>https://vuex.vuejs.org/guide/</small>

<aside class="notes">
</aside>
