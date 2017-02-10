#### Configuring electron

###### electron/main.js

```javascript
function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 })
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../www/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.on('closed', () => {
    win = null
  })
}
```

<aside class="notes">
che contiene i dati di apertura, tra cui, molto importanti, la dimensione della finestra e il file principale da aprire. Nel nostro caso andiamo a puntare al file index nella cartella www. Nell’evento closed della finestra svuotiamo la variabile win.
</aside>
