### Example app

Home component, data and computed function

```diff
@@ src/views/Home.vue
-  data() {
-    return {
-      availableNumbers: [...Array(90).keys()].map((i) => i + 1),
-      extractedNumbers: [],
-    };
-  },
   computed: {
-    ascendingExtractedNumbers() {
-      return [...this.extractedNumbers].sort((a, b) => a - b);
-    },
+    ...mapState(['availableNumbers', 'extractedNumbers']),
+    ...mapGetters(['ascendingExtractedNumbers']),
   },
```

<aside class="notes">
Now we change the Home component removing data and computed values,
and using them directly from the store, mapping state and getters
in the computed section.

Having the same name as the origina values, we don't need to rename anything
else.
</aside>
