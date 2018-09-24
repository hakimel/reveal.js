## Python


---


### Run

___

```
$ python3 main.py    # Run
```


---

### print

___

```
print("Hello, Python!")    # print
```

---

### 変数

___

```
hoge = 1    # 変数定義(2回目以降は上書き可能)
huga = "huga"
```

---

### 型変換

___

数値型と文字列型の連結はできないので、その時に使用する

```
huga = "10"
hoge = 100

# int({String})   # String -> int  変換
# str({int})    # int -> String 変換

print (str(hoge) + "円")    # 100円
print (int(huga) + 10)    # 20

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

