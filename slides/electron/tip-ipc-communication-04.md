#### Tip: ipc communication

##### Async

```javascript
// www/js/script.js

const { ipcRenderer } = require('electron')

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg)
})
const btnIpcAsync = document.getElementById('btnIpcAsync')
btnIpcAsync.onclick = () => {

  ipcRenderer.send('asynchronous-message', 'ping async')

}
```

<aside class="notes">
</aside>
