### Example app

Home component, data and computed function

```diff
# src/views/Home.vue
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
</aside>
