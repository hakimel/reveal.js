#### Installing electron-builder

```bash
# globally
npm install -g electron-builder
# use with `electron-builder`

# or

# local dependency
npm install --save-dev electron-builder
# use with `npx electron-builder`
```

###### package.json

```json
"scripts": {
  "dist": "electron-builder -mwl",
  "pack": "electron-builder -mwl --dir"
},
```

<aside class="notes">
</aside>
