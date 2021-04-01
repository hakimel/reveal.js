#### Example app

Structure

<img alt="Example app" width="60%" src="slides/vuex/images/02-app-structure.png">


<aside class="notes">
Let's split our app in sub-components.
This app, for example, consists of four components:

- the header, displaying the app informations like title and version number

- the footer

- the main component, containing all our application's logic, the two lists of numbers, available and extracted,
    and the currently extracted number

- the list component, a generic component displaing a list of numbers and a title. Everything is passed by props

Now let's look at the code, it's more interesting than this horrible mess.
</aside>
