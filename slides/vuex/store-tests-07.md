#### Store tests

Actions

Mocking axios success

```js
const { getRecords } = actions;
test('getRecords success', async () => {
  const commit = jest.fn();
  axios.get.mockResolvedValue({ data: 'ok' });
  await getRecords({ commit });
  expect(commit).toHaveBeenCalledWith('getRecordsRequest');
  expect(axios.get).toHaveBeenCalledWith('/api/records/');
  expect(commit).toHaveBeenCalledWith(
    'getRecordsSuccess', 'ok');
});
```

<aside class="notes">
Here we are testing the success, mocking the resolved value of axios get
and mocking the context commit function passed to the action call.
Note that this test is async, because we need to wait the end of the asynchronous
action.
We check that commit is called with "getRecordsRequest",
axios get is called with our desired endpoint
and then commit called again with success and the return value from API,
string "ok" in this example.
</aside>
