## GitHub


---


### Clone

```
$ git clone {レポジトリURL}    # レポジトリをCloneする
```

---

### Push

```
$ git init   # 初期化

$ git remote add origin {レポジトリURL}

$ git add {追加ファイル}    # ワイルドカード -> . / -A
$ git add -u    # 変更点のあるファイルのみadd

$ git commit -m "{コミットメッセージ}"

$ git push {ブランチ名}
```


---

### Pull


---

### Branch

```
$ git branch    # ブランチの確認

$ git checkout {ブランチ名}    # ブランチの作成

$ git checkout -b {ブランチ名}    # ブランチの作成+切り替え

$ git pull {ブランチ名}    # ブランチをPull
```


---

### .gitignore

```
#で始まる行は全て無視

{ファイル名}    # そのファイルを管理下から除外

*.{拡張子}    # その拡張子全てを管理下から除外

{フォルダ名}/    # そのフォルダ以下全てを管理下から除外

!/.{フォルダ名}/{ファイル名}    # このパターンのみ除外しない

{フォルダ名}/*.{拡張子名}    # フォルダ内の指定拡張子のみ管理下から除外
```

