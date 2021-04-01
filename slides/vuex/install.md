### Install Vuex

```html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

or

```sh
npm install --save vuex
# or
yarn add vuex  # https://yarnpkg.com/
# or
npx @vue/cli add vuex  # https://cli.vuejs.org/
```

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
```

<small>https://vuex.vuejs.org/installation.html</small>

<aside class="notes">
How can you install Vuex in your project?
It depends on the structure of your project.

You can use the script approach, pointing directly to the downloaded vuex script.

Or you can install it using npm, yarn or the vue cli.

For the second option you need to tell Vue that you are using Vuex.
</aside>
