#### Tip: auto-update your app

###### Advanced usage

```js
// electron/main.js

function sendStatusToWindow(text, timeout = 20000) {
  win.webContents.send('update-message', {
    body: text,
    timeout,
  })
}
```
