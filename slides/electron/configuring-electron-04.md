#### Configuring electron

###### electron/main.js

```javascript
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
```

<aside class="notes">
Altre due piccole cose: se non siamo su un mac, nel “window-all-closed” chiudiamo completamente l’applicazione. Su mac resta nel dock e risponde all’activate della funzione sotto, ricreando la finestra se non ne esistono di aperte.
</aside>
