#### Tip: links

```javascript
const {shell} = require('electron')

// ...

function createWindow() {
  // ...
  win.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });
}
```

<aside class="notes">
Un ultimo suggerimento: come abbiamo visto, aprendo un link l’appicazione viene duplicata, se vogliamo evitare questo comportamento possiamo modificare il file main.js in questo modo.
</aside>
