#### Tip: ipc communication

##### Sync

```javascript
// www/js/script.js

const { ipcRenderer } = require('electron')

const btnIpcSync = document.getElementById('btnIpcSync')
btnIpcSync.onclick = () => {
  console.log(

    ipcRenderer.sendSync('synchronous-message', 'ping sync')

  )
}
```

<aside class="notes">
</aside>
