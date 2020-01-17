#### Tip: auto-update your app

###### Advanced usage

```js
// www/js/script.js

const { ipcRenderer } = require('electron')

ipcRenderer.on('update-message', function (event, { body, timeout }) {
  const notification = new Notification('AutoUpdate', {
    body
  })
  setTimeout(() => {
    notification.close()
  }, timeout)
})
```
