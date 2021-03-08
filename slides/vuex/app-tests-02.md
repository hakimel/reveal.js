#### Component tests

Home #1

```js
import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';

const shallowMountComponent = () => shallowMount(Home, {
  stubs: ['v-container', 'v-btn', 'v-row', 'v-col'],
});

test('renders as expected', () => {
  const wrapper = shallowMountComponent();
  expect(wrapper).toMatchSnapshot();
});

// ...
```

<aside class="notes">
</aside>
