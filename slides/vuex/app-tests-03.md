#### Component tests

Home #2

```js
// ...
test('extracts a number and render as expected', async () => {
  jest.spyOn(global.Math, 'random')
    .mockReturnValueOnce(0.123456789)
    .mockReturnValueOnce(0.987654321);
  const wrapper = shallowMountComponent();
  wrapper.vm.handleExtract();
  await wrapper.vm.$nextTick();
  expect(wrapper).toMatchSnapshot();
  wrapper.vm.handleExtract();
  await wrapper.vm.$nextTick();
  expect(wrapper).toMatchSnapshot();
  jest.spyOn(global.Math, 'random').mockRestore();
});
```

<aside class="notes">
</aside>
