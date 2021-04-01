#### Store tests

Actions

Mocking calls using jest

```js
import axios from 'axios';
import { actions } from '@/store';

jest.mock('axios', () => ({
  get: jest.fn(),
}));
```

<small>
<ul>
<li><code>.mockReturnValue(value)</code> for mocking sync results</li>
<li><code>.mockResolvedValue(value)</code> for mocking async results with success</li>
<li><code>.mockRejectedValue(value)</code> for mocking async results with failure</li>
</ul>
</small>
 

<small>https://jestjs.io/docs/mock-functions</small>

<aside class="notes">
First thing to do is mock axios, we dont need to call the real api endpoint,
so we mock the get function. Later on we can mock the return value,
or use mockResolvedValue or mockRejectedValue for mocking async results with
success or failure.
</aside>
