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
I know, I know, you are thinking
"Wait, are we testing this useless app? What can go wrong here?"
You are right, I did not tested this app at the beginning,
but it's very useful for understanting, later on, how to test components which uses Vuex.

We are testing the sub-component, mocking the Vuetify pre-made components and passing specific properties.
Then we expect that the mounted component match our snapshot.
</aside>
