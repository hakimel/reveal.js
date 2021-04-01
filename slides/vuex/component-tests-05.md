#### Component tests mocking the store

```js
  // ...
  test('snapshot test with default props', () => {
    const wrapper = shallowMount(Home, { store, localVue });
    expect(wrapper).toMatchSnapshot();
    // ...
  });
});
```

<small>https://vue-test-utils.vuejs.org/guides/using-with-vuex.html</small>


<aside class="notes">
We can now mount the component passing our mocked store and the localVue instance.
After that, we can check for snapshots and continue our unit tests.
We can also optionally check that a button click is triggering the desired mutation or action.

The tricky part is mocking the store, in this example I created a mocked
store that is the same before each test case, but you can have a specific
mocked store that is different, causing different snapshots.
Each test case is specific, so you can act accordingly to your needs.
</aside>
