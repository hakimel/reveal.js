#### Tip: create-react-app compatibility

###### Fix: [http://tiny.cc/5jxyiz](https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3)


```bash
# use yarn
yarn install --dev electron
yarn install --dev electron-builder
yarn run ...
```

```js
// add `homepage` in `package.json`
"homepage": "./",
```

```bash
# move `electron/main.js` in `public` folder
electron/main.js => public/electron.js
```


<aside class="notes">
</aside>
