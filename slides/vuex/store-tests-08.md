#### Store tests

Actions

Mocking axios failures

```js
const { getRecords } = actions;
test('getRecords failure', async () => {
  const commit = jest.fn();
  axios.get.mockRejectedValue('my error');
  try {
    await getRecords({ commit });
    // Fail test if above expression doesn't throw anything
    expect(true).toBe(false);
  } catch (error) {
    expect(commit).toHaveBeenCalledWith('getRecordsRequest');
    expect(axios.get).toHaveBeenCalledWith('/api/records/');
    expect(commit).toHaveBeenCalledWith(
      'getRecordsFailure', 'my error');
  }
});
```

<aside class="notes">
Same for failures, mocking the axios get with a rejected value.

We then call the action, raising an error and failing tests if not, just to be sure.

In the catch branch we check that commit is called with "getRecordsRequest",
axios get is called with our desired endpoint
and then commit called again with failure and the error returned from API,
string "my error" in this example.
</aside>
