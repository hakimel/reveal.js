#### Tip: web tools

How to disable web tools in production?

```javascript
// electron/main.js

  // ...
  win = new BrowserWindow({
    // ...
    webPreferences: {
      devTools: false,
      // ...
    }
    // ...
  })
```

<aside class="notes">
</aside>
