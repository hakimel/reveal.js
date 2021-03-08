#### Example app

Main component template

```html
    <button @click="handleExtract">Extract</button>

    <h1>
      Extracted:
      {{ extractedNumbers[extractedNumbers.length - 1] }}
    </h1>

    <DisplayNumbers title="Available numbers"
      :numbers="availableNumbers" />

    <DisplayNumbers title="Extracted numbers"
      :numbers="ascendingExtractedNumbers" />
```

<aside class="notes">
</aside>
