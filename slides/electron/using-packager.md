#### Using electron-packager

```bash
electron-packager . myFirstApp \
> --platform=all \ # darwin, linux, mas, win32
> --arch=all \ # ia32, x64, armv7l
> --icon 'icons/icon' \
> --out=dist-desktop \
> --overwrite

# for more info
electron-packager --help
```

<aside class="notes">
Ora ci è sufficiente lanciare un comando per avere una nostra app compilata per la piattaforma che più preferiamo!
</aside>
