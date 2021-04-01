#### Component tests mocking the store

```js
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Home from '@/views/Home.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

// ...
```

<small>https://vue-test-utils.vuejs.org/guides/using-with-vuex.html</small>


<aside class="notes">
We can mock the store, creating a local instance of Vue using createLocalVue
and adding the usage of Vuex.
</aside>
