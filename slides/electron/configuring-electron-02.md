#### Configuring electron

###### electron/main.js

```javascript
const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let win

app.on('ready', createWindow)
```

<aside class="notes">
Importiamo da electron “app” e “BrowserWindow” che utilizzeremo dopo, poi abbiniamo al “ready” dell’applicazione la funzione “createWindow”,
</aside>
