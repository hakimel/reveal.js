## Go


---


### Run, Build

```
$ go run {}.go    # 実行

$ go build {}.go    # コンパイルして実行ファイルを生成, 実行
```

---

### Print

```
println ({})    // {}をprint
```

---

### プログラムの構成

```
package main    // パッケージ定義部分

func main(){    // 関数定義部分
    println("Hello, Go!")
}
```


---

### コメント

```
/*
    ブロックコメント
*/


// コメント
```

---

### 変数とデータ型

```
var {変数名} {データ型}
```

データ型 ... int, string

---

### 変数の基本

```
package main
func main(){
    var n int
    n = 100    // 変数nに100を入れる
    println(n)    // nには100が入っているので、100を出力
}
```

```
package main
func main(){
    var n int = 100    // 定義と代入を同時に行う
    println(n)
```

---

### 変数の値を更新

```
package main
func main(){
    var n int = 100  
    println(n)   
    n = 200    // nを200に更新
    println(n)    // 200を出力
```

---

### データ型の省略

```
package main
func main(){
    var a = 100    // intが省略されている
    println(a)    
}
```
100が整数であり, そこから変数aに代入される値のデータ型がint型であることが明らかなため.

---

### 変数定義の省略した書き方

```
package main
func main(){
    b := 200    // var b int = 200 と同じ意味
    println(b)    
}
```
---

### printlnの便利な書き方

```
package main
func main(){
    a := 100
    b := 200   
    println(a, b)    // 100 200 を出力
}
```

コンマは出力されず, スペースで区切られて1行で表示される.

---

### 変数定義と代入の違い

```
package main
func main(){
    a := 100
    a := 200    // エラー発生!
    println(a)   
}
```
Goでは同じ変数を複数回定義できない

---

### 自己代入

```
package main
func main(){
    n := 10
    n = n + 10    // nにn+10を代入し直す
    println(n)    // 20を出力
}
```

---

### 自己代入の省略

```
n = n + 10  ->  n += 1
n = n - 5   ->  n -= 5
n = n * 3   ->  n *= 3
n = n / 2   ->  n /= 2
n = n % 2   ->  n %= 2
```

```
n = n + 1   ->  n++
n = n - 1   ->  n--

```