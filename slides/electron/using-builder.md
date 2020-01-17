#### Using electron-builder

```bash
npm run pack
# electron-builder -mwl --dir

# or

npm run dist
# electron-builder -mwl
```

##### BUT WAIT

<small>

- On Linux and Windows you cannot sign macOS apps

    ```bash
    skipped macOS application code signing  reason=supported only on macOS
    ```

- On Linux and Windows you cannot build DMG archive for macOS

</small>

<aside class="notes">
</aside>
