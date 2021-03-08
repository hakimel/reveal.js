#### Component tests

DisplayNumbers

```js
import { shallowMount } from '@vue/test-utils';
import DisplayNumbers from '@/components/DisplayNumbers.vue';

test('renders as expected', () => {
  const wrapper = shallowMount(DisplayNumbers, {
    stubs: ['v-container', 'v-card', 'v-card-title', 'v-card-text', 'v-chip'],
    propsData: {
      title: 'title text',
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
  });
  expect(wrapper).toMatchSnapshot();
});
```

<aside class="notes">
</aside>
