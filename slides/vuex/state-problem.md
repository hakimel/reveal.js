#### State problem

<img alt="Example app" width="65%" src="slides/vuex/images/03-app-problem.png">


<aside class="notes">
What if we need to display something outside our main component?
For example, what if we want to display a count of remaining numbers,
or the last five extracted numbers in the footer?

Yes, it seems strange, but in the retirement home
they were constantly asking those two informations.
Maybe they forgot to check for a number, or they need to know when they can escape from our companionship,
I don't know, but we needed to provide those two informations a lot of times, trust me.

The problem here, is that our state is in the main component, sibling of the footer.
</aside>
