#### Component tests mocking the store

```js
// ...
describe('Home.vue', () => {
  let state, getters, mutations, actions, store;
  beforeEach(() => {
      state = { count: 0 };
      getters = { getter1: 'mocked return value' };
      mutations = { mutation1: jest.fn() };
      actions = { action1: jest.fn() };
      store = new Vuex.Store({
        state, getters, mutations, actions });
  });
  // ...
```

<small>https://vue-test-utils.vuejs.org/guides/using-with-vuex.html</small>


<aside class="notes">
Then we can create a store, mocking the desired chunk of the state,
passing whatever we want, a custom default state, custom getters,
mocked mutations and/or actions.

We put the creation of the store inside a beforeEach statement, so it's created
before each test case.

Declaring variables outside the statement let us to use them later on, in each test case.
</aside>
