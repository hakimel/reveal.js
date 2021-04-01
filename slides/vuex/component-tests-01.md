#### Component tests using original store<br>(not suggested)

```js
import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';
import store from '@/store';

test('snapshot test with default props', () => {
  const wrapper = shallowMount(Home, { store });
  expect(wrapper).toMatchSnapshot();
});
```

<small>https://vue-test-utils.vuejs.org/guides/using-with-vuex.html</small>


<aside class="notes">
After testing our store, we should test components too.

We can shallowMount our component passing the original store,
testing like nothing's happened, but this is not suggested...why?
</aside>
