#### Tip: progress bar

```javascript
// www/js/script.js
const { ipcRenderer } = require('electron')

ipcRenderer.on('test-progress-bar-reply', () => {
  new Notification('Progress completed', {
    body: 'All progress are completed'
  })
})

const btnIpcProgress = document.getElementById('btnIpcProgress')
btnIpcProgress.onclick = () => {
  ipcRenderer.send('test-progress-bar')
}
```

<aside class="notes">
</aside>
