#### Component tests using original store<br>(not suggested)

<span style="color:green">Pros</span>

- fast and easy, store implementation ready-to-use


<span style="color:red">Cons</span>

- less control over store mocking and external calls


<small>https://vue-test-utils.vuejs.org/guides/using-with-vuex.html</small>


<aside class="notes">
Well, it'a fast and easy approach, we don't have to mock a chunk of the store.
This could be used in integration testing, but unit tests should be related
only to the component, without relying on external implementations.

We have less control over store mocking and external calls, so we need another approach.
</aside>
