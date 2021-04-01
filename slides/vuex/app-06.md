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
Oh yes, I forgot the template section for our main component.
It contains the "Extract" button, calling our "mutation",
the header, displaying the last extracted number,
and two sub-components displaing the two lists we have,
the first from component data (our state),
the second from our computed section (our getter).
</aside>
