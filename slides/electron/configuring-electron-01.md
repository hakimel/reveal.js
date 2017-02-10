#### Configuring electron

###### package.json

```json
{

  "name": "electron_sample",

  "version": "0.1.0",

  "main": "electron/main.js"

}
```

<aside class="notes">
Assicuriamoci che in package.json siano presenti “name” e “version”, verranno utilizzate come nome e versione app di Electron. Molto importante è il “main” file, è quello che contiene la configurazione di Electron, con i file da lanciare all’avvio e il comportamento da adottare nei vari eventi dell’app. Andiamo ad analizzarlo meglio.
</aside>
