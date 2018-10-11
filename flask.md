## Flask

---

### Flaskとは

___

- Pythonの小規模WEBフレームワーク

---

### 最小構成

___

```
from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello():
    return 'Hello, World!'

```

---

### 問題点

___

プロジェクトが大きくなるにつれ、全てのコードを１つのファイルに格納することは難しくなる
そのため、パッケージを利用してコードをモジュールで整理し、必要に応じてインポートする。

---

### プロジェクトのディレクトリ

___

```
/home/user/Projects/flask-tutorial
├── flaskr/
│   ├── __init__.py
│   ├── db.py
│   ├── schema.sql
│   ├── auth.py
│   ├── blog.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── auth/
│   │   │   ├── login.html
│   │   │   └── register.html
│   │   └── blog/
│   │       ├── create.html
│   │       ├── index.html
│   │       └── update.html
│   └── static/
│       └── style.css
├── tests/
│   ├── conftest.py
│   ├── data.sql
│   ├── test_factory.py
│   ├── test_db.py
│   ├── test_auth.py
│   └── test_blog.py
├── venv/
├── setup.py
└── MANIFEST.in
```

---

### .gitignoreの書き方

___

```
venv/

*.pyc
__pycache__/

instance/

.pytest_cache/
.coverage
htmlcov/

dist/
build/
*.egg-info/
```

---

### セットアップ1

___

`flaskr`ディレクトリを作成し、`__init__.py`ファイルを追加する。

```
$ mkdir flaskr
```

`__init__.py`はアプリケーションファクトリを含み、Flaskディレクトリをパッケージであることを証明する。

---

### セットアップ2

___

`flaskr/__init__.py`

```
import os

from flask import Flask


def create_app(test_config=None):
    # アプリの作成と設定
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # 存在していれば、テストしていないときにインスタンスのconfigをロードする
        app.config.from_pyfile('config.py', silent=True)
    else:
        # 渡された場合はテスト設定を読み込む
        app.config.from_mapping(test_config)

    # インスタンスフォルダが存在することを確認する
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # hello という
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    return app
```

---


