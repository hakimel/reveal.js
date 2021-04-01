### Example app

Home component, method

```diff
@@ src/views/Home.vue
-    <button @click="handleExtract">Extract</button>
+    <button @click="extractNumber">Extract</button>

   methods: {
-    handleExtract() {
-      const index = Math.floor(Math.random() * this.availableNumbers.length);
-      const extracted = this.availableNumbers.splice(index, 1);
-      this.extractedNumbers = this.extractedNumbers.concat(extracted);
-    },
+    ...mapMutations(['extractNumber']),
   },
```

<aside class="notes">
Our last change is in the methods, mapping the mutations from the store and using
that mutation as handler of the button click.

When a user clicks on the button, the store will automatically commit
that mutation, changing the store state and triggering a re-render of our component,
because with "mapState" and "mapGetters" we are listening to changes in the store
to our mapped values.
</aside>
