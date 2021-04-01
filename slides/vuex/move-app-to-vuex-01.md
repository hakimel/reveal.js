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
Now, a long time ago in a galaxy far, far away, there was our bingo application.
Do you remember?
Let's move it to Vuex!

Notice that we are creating every single part of the store as an exported constant,
like the defualtState in the example,
this way we can test that single part with a simple import.

We moved the original data section of the Home component inside the default
store state.
</aside>
