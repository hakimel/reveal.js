#### <span style="color:red">cons</span>


- multiple views may depend on the same piece of state

- actions from different views may need to mutate the same piece of state

- messy on big apps, lots of extra code for passing props, emitting events

- hard to follow state changes on many levels

    <small>what is causing a data change?</small>


<aside class="notes">
But, unfortunately, we have some cons:

- multiple views may depend on the same piece of state, like in our example

- actions from different views may need to mutate the same piece of state

- can be messy on big apps, a lot of extra code is needed for passing props and emitting events

- it can be hard to follow state changes on many levels, what if we need to know what is causing a data change?

Here it comes...Vuex!
</aside>
