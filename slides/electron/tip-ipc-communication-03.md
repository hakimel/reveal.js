#### Tip: ipc communication

##### Async

```javascript
// electron/main.js

const { ipcMain } = require('electron')

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg)
  setTimeout(() => {

    event.reply('asynchronous-reply', 'pong async')

  }, 1000)
})
```

<aside class="notes">
</aside>
