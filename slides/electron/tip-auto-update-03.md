#### Tip: auto-update your app

###### Configuration (electron/main.js)

3. Use autoUpdater from electron-updater instead of electron:

    ```js
    const { autoUpdater } = require('electron-updater')
    ```

4. Call update function

    ```js
    app.on('ready', () => {
      setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify()
      }, 1000)
    })
    ```
