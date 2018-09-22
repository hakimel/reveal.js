## Python


---


### Run

___

```
$ python3 {ファイル名}.py    # Run
```


---

### print

___

```
print({内容})    # print
```

---

### 変数

___

```
{変数} = {値}    # 変数定義(2回目以降は上書き可能)
```

---

### 型変換

___

数値型と文字列型の連結はできないので、その時に使用する

```
int({String型})    # int -> String 変換

str({int型})    # String -> int 変換
```


---


### if文

___

```
if {条件式} :
{中身}     # ❌
    {中身}    # ⭕️
    
elif {条件式} :
    {中身}

else :
    {中身}

```

**中身を書くときはインデントが必要**


---


### 論理演算子 ~ and ~

___

```
True and True - > True

True and False / False and True -> False

False and False -> False
```


---


### 論理演算子 ~ or ~

___

```
True or True - > True

True or False / False or True -> True

False or False -> False
```


---


### 論理演算子 ~ not ~

___

```
not False -> True

not True -> False
```

