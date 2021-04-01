#### <span style="color:green">pros</span>

- fast and easy in small apps

- keep the state in the components where it is used

    <small>(if there is no need to pass it to other components)</small>

- no extra dependencies

- testing sub-components with `propsData` and snapshots


<aside class="notes">
The pros of this approach are that it's fast and easy in small apps, like this one.

We can keep the state inside the components where it's used (if there is no need to pass it to other component).

We don't have extra-dependency managing the state.

We can simply test our sub-components using propsData and snapshots.
</aside>
