#### Vuex flow


<img alt="Vuex flow" width="60%" src="slides/vuex/images/vuex-flow.png">


<aside class="notes">
Wow, another chart!

This one represents the Vuex flow, it's similar to the one we saw before, let me explain:

Inside Vuex we have our state, a component renders based on the state,
then it can "dispatch" actions that commit mutations, mutating the state and
causing a re-render of the component.

Please note that actions can use external services like calling API,
and mutations can be tracked by devtools like the official "Vue.js devtools" extension for Google Chrome.
</aside>
