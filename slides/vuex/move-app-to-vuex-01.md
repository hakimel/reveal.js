### Example app

Creating the store, default state

```js
// src/store/index.js

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const defaultState = {
  availableNumbers: [...Array(90).keys()]
                        .map((i) => i + 1),
  extractedNumbers: [],
};
```

<aside class="notes">
</aside>
