#### Tip: ipc communication

##### Sync

```javascript
// electron/main.js

const { ipcMain } = require('electron')

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)
  setTimeout(() => {

    event.returnValue = 'pong sync'

  }, 1000)
})
```

<aside class="notes">
</aside>
