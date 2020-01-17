#### Tip: links

```javascript
// electron/main.js

const { shell } = require('electron')

// ...

// open new-window externally
app.on('ready', () => {
  win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })
})
```

<aside class="notes">
</aside>
