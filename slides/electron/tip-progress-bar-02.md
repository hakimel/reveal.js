#### Tip: progress bar

```javascript
// electron/main.js
const { ipcMain } = require('electron')

ipcMain.on('test-progress-bar', (event, arg) => {
  let progressVal = 0
  const interval = setInterval(() => {
    progressVal += 1
    win.setProgressBar(progressVal / 100)
    if (progressVal == 100) {
      clearInterval(interval)
      win.setProgressBar(-1)
      event.reply('test-progress-bar-reply')
    }
  }, 100)
})
```

<aside class="notes">
</aside>
