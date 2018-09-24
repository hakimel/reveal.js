## Docker


---


### Dockerとは?

___

- Linuxのコンテナ技術を使ったもので, よく仮想マシンと比較される
- コンテナはホストマシンのカーネルを利用し, プロセスやユーザなどを隔離することで, あたかも別のマシンが動いているかのように動く.
- 軽量で高速に起動, 停止などが可能.


---



### Dockerの利点

___

- コード化されたファイルを共有することで, どこでも誰でも同じ環境が作れる
- 作成した環境を配布しやすい
- スクラップ&ビルドが容易にできる


---


### Dockerの構造

___

![Docker](https://knowledge.sakura.ad.jp/images/2018/01/VM_Container-768x437.jpg)


---



### Pull

___

```
$ sudo docker search {name} | more    # {name}を探す
$ sudo docker pull {name}    # {name}をPull
$ sudo docker images    # 確認
$ sudo docker inspect {ID}    #{ID}のイメージの詳細を確認
$ sudo docker rmi {ID}    # {ID}のイメージを削除
```

---

### Run

___

```
$ sudo docker run {イメージ名} echo "{内容}"    # 内容を表示
$ sudo docker ps    # 実行中のコンテナを確認
$ sudo docker ps -a    # 終了したコンテナ
$ sudo docker os -a -n={数字}    # 最後の{}個だけ表示
$ sudo docker rm {ID 最初の３文字}    # コンテナを削除
```

---

### Containerの操作

___

```
$ sudo docker run -d {イメージ名} free -s 3    # 3秒ごとにlog 
$ sudo docker ps    # 実行中のタスク
$ sudo docker logs {ID}    # ログを見る
$ sudo docker attach --sig-proxy=false{ID} 
$ sudo docker kill {ID}    # タスクの終了
$ sudo docker start {ID}    # タスクの再開
```

---

### Image を作る

___

```
$ sudo dokcer run -i -t {イメージ名} /bin/bash    # イメージ内でターミナル起動
$ exit    # 終了
$ sudo docker commit {ID} {ユーザー名}/{ファイル名}    # イメージ作成
$ sudo docker -i -t {ユーザー名}/{ファイル名} /bin/bash    # イメージ作成→ターミナル起動
```
`-i` はインタラクティブモード
`-t` はターミナルを開くモード

---

### Docker Build - 1

___

```
$ vi Dockerfile
```

``` 
FROM {イメージ名}
MAINTAINER {名前}  <メールアドレス>

# RUN: {Buildするときに実行される
RUN echo "{}"

#CMDL runするときに実行されるもの
CMD echo "{}"}    # 非推奨
CMD ["echo","{}"]    # 推奨
```

---

### Docker Build - 2

___

```
$ sudo dokcer build -t {イメージ名} .
# `-t` で名前をつける。 `.`はカレントディレクトリなので必須

$ sudo docker images    # イメージの確認
$ sudo docker run {イメージ名}    # Run
```
