#### Configuring electron

###### electron/main.js

```javascript
const { app, BrowserWindow } = require('electron')

function createWindow () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('www/index.html')
}

app.on('ready', createWindow)
```

<aside class="notes">
</aside>
