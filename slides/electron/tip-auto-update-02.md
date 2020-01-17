#### Tip: auto-update your app

###### Configuration

1. Install electron-updater as an app dependency.

    ```bash
    npm install --save electron-updater
    ```

2. Configure publish in `electron-builder.yml`.

    ```yml
    publish:
        provider: generic
        url: https://your.release.website/release_path/
    
    mac:
        target: [dmg, zip]  # add zip, important!
    ```
