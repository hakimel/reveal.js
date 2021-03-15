### Example app

Home component, method

```diff
# src/views/Home.vue
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
</aside>
