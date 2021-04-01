#### Moving to Vuex store flow

Vue.js component | Vuex store | Map in
----|----|----
`data`          | state     | computed
`computed`      | getters   | computed
sync `methods`  | mutations | methods
async `methods` | actions   | methods


<aside class="notes">
A quick recap when moving from component logic to a Vuex store:

we should move data properties from the component to the store state, and map them in the computed section of the component,

computed values could becomes getters, mapped in the computed section

synchronous methods changing the state will be store mutations, mapped as methods

asynchronous methods should be actions, mapped as methods
</aside>
