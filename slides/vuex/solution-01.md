Solution 1: Moving state to parent components

- move `data()` from Home to App

- receiving numbers in Home and Footer as props

- emitting an event when "Extract" button is clicked in Home

- handling extract event in App component, moving methods from Home to App

- updating tests

<aside class="notes">
A first approach can be moving the state into a parent component.
Keep in mind that we should have an App component on top of all,

- we can move the state there,

- changing Home and Footer enabling them to receive numbers as props,

- emitting an event when the extract button is clicked in Home

- handling the extract event in the App component, moving methods from Home to App,

- updating tests

Nice and easy
</aside>
