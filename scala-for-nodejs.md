# Scala 101
<img src="https://media.giphy.com/media/MGdfeiKtEiEPS/giphy.gif">

### Matan Keidar

---

## Outline
- Why Scala (background)
- Basic JVM
- val vs. var vs. def
- tuples (-> vs , and _.1)
- loops
- functions
- implicits
- partial functions / composition
- functional programming (map, flatMap, filter, foldLeft)
- Basic data structures
- basic effects: Option, Try, Either
- pattern matching
- Async (Future vs. promise)
- for comporehension
  - chaining concept
- Implicits args
- Implicit conversions

---

## (Very) Short Intro To JVM
- JVM: Java Virtual Machine
- Responsible for interpreting compiled bytecode 
- Result: interoperabilty between JVM languages
- Great optimizations in runtime (JIT)

---

## Why Scala?
- Best of all worlds
  - All battle-tested JVM optimizations (~25 years)
  - Modern language and advanced features
- Both OOP and Functional
  - Developer is free to choose
- Scalable language
  - Scripting, infras and even FE
  - Concurrent and async apps
- Big data pipelines 

---

## Variables
```scala
// these are the same
var a: String = "hello"
var a = "hello"

// mutable
var a = "hello"
a = "world"

// does not compile
val a: String = "hello"
a = 5
```


## Values
```scala
// These are the same
val a: String = "hello"
val a = "hello"

// does not compile
val a: String = 5

// does not compile
a = "world"
```


## Definitions
```scala
def a = "hello"

def add = {
  val x = 1
  val y = 2
  x + y
}
```


## Quiz: Are these the same?

<div class='left' style='float:left;width:400px; font-size: 50px'>
  <pre><code data-trim data-noescape class="scala">
  // program 1  
  val x = {
    println("calc x")
    42
  }
  </code></pre>
</div>

<div class='right' style='float:right;width:400px; font-size: 50px'>
 <pre><code data-trim data-noescape class="scala">
  // program 2
  def x = {
    println("calc x")
    42
  }
  </code></pre>
</div>

---

## Tuples
```scala
val t2 = ("matan", 39)           // (String, Int)
val t3 = ("matan", "keidar", 39) // (String, String, Int)

// access to elements by index
val lastName = t3._2 // "keidar"
```

### special case of Tuple-2 
```scala
val t2 = "matan" -> 39 // aka association, same as ("matan", 39)

val numbers = Map(
  "I"   -> 1,
  "II"  -> 2,
  "III" -> 3,
  "IV"  -> 4
)
```

---

## Loops
```scala
val nums = List(1,2,3)

// for loop
for (i <- 1 to nums.size) { println(n) }
for (n <- nums) println(n)

// while loop
var i = 0
while (i < nums.size) println(num(i))
```

We are functional, do not do it! 😡

---

## Functions
```scala
def add(x: Int, y: Int) = x + y
def mult(x: Int, y: Int) = {
  x * y
}
```


## Functions
### Argument lists
```scala
def add1(x: Int, y: Int) = x + y
def add2(x: Int)(y: Int) = x + y

add1(1, 2) == 3
add2(1)(2) == 3
```

---

## Basic Collections
```scala
val myArray = Array(1,2,3,3) // (1,2,3,3)
val myList = List(1,2,3,3)   // (1,2,3,3)
val mySeq = Seq(1,2,3,3)     // (1,2,3,3)
val mySet = Set(1,2,3,3)     // (1,2,3)

val myMap = Map(1 -> "one", 2 -> "two")
```

---

## Basic Effects
- Effect: a value with context
- Represents a computation
- Computations can be wrapped and chained
- Provides semantic information as well


## Basic Effects
### Option[T]
- Represents emptiness, a value that exists or not 
- `Some[T]`: an existing value
- `None`: an empty value
```scala
val x: Option[Int] = Some(42)
val y: Option[Int] = None
```


## Basic Effects
### Try[T]
- Represents a computation that can fail
- `Success[T]`: successful result of the computation
- `Failure[Throwable]`: failed computation
```scala
val x: Try[String] = Success("Hello There")
val y: Try[String] = Fail(new RuntimeException("Boom!!!"))
```


## Basic Effects
### Either[S, T]
- A computation that can return either `S` or `T`
- But NOT both!
- `Right[T]` or `Left[T]`
- Usually, left side represents failure
```scala
val x: Either[Int, String] = Right("Hello There")
val y: Either[Int, String] = Left(-1)
```


## Basic Effects
### Future[T]
- Represents an async computation that can fail

```scala
val x: Future[String] = Future( "hello world")

def div(n: Int) = Future { 
  log("failing")
  n / 0 
}
```

---

## Basic Functional Programming

Goal: Write defensive code with minimal lines of code

```scala
case class User(
  id: String, 
  name: String, 
  manager: Option[User] = None
)

def findUser(id: String): Option[User]
```


## Basic Functional Programming
```scala
// option 1
def findUser(id: String): Option[User]

val maybeUser = findUser("1234")

if (maybeUser.isDefined) {
  // do domething
  val user = maybeUser.get
  println(user)
}
```


## Basic Functional Programming
### map
Traverse each element and apply a function
```scala
val myList = List(1,2,3,4)

//myList.map(f: A => B)

myList.map(x => x * 2) // List(2,4,6,8)
myList.map(_ * 2) // same
```


## Basic Functional Programming
### flatMap
Same as map, but `f` returns value wrapped with context

```scala
val myList = List(1,2,3,4)

myList.flatMap(x => List(x, x)) // List(1,1,2,2,3,3,4,4)
```


## Basic Functional Programming
### filter
Choose which elements are passed through 

```scala
val myList = List(1,2,3,4)

myList.filter(x => x % 2 == 0) // List(2,4)
myList.filter(_ % 2 == 0) // same
```



## Basic Functional Programming
```scala
// option 2
def findUser(id: String): Option[User]

val maybeUser = findUser("1234")

maybeUser.map(user => println(user))
// or
maybeUser.map(println)
// or
findUser("1234").map(println)
```


## Basic Functional Programming
How to return a managers list?
```scala
case class User(
  id: String, 
  name: String, 
  manager: Option[User] = None
)

def findUser(id: String): Option[User]

val userIds: List[String] = ???
```


## Basic Functional Programming
How to return a managers list?
```scala
userIds
  .flatMap(id => findUser(id))
  .flatMap(user => user.manager)
  .map(manager.id)

userIds
  .flatMap(findUser)
  .flatMap(_.manager)
  .map(_.id)
```

---

## For Comprehension
- Chains of functional combinators are cumbersome
- Syntactic suger for flatMap/map/filter

```scala
for {
  userId  <- userIds
  user    <- findUser(userId)
  manager <- user.manager
} yield manager.id

for {
  userId  <- userIds
  user    <- findUser(userId)
  if user.manager.isDefined // just to show if example
  manager <- user.manager
} yield manager.id
```


## For Comprehension
Can be considered as SQL-like syntax

```scala
val result = for {
  x <- List(1,2,3) // FROM
  if x % 2 == 0    // WHERE
} yield {
  x + 1            // SELECT
}

// result: List(3)
```

---

## Pattern Matching
- One of the most powerful Scala features
- Adopted by other languages
- Switch/case on steroids
- Works both on case classes and primitive types

```scala
val dima  = User(id = "1", name: "Dima",  manager = None)
val matan = User(id = "2", name: "Matan", manager = Some(dima))

matan match {
  case User(_, name, None) => 
    println(s"user $name does not have manager")
  
  case User(_, name, Some(User(_,manager,_))) => 
    println(s"user $name has manager: $manager")
}
```


## Are these the same?
<!-- .slide: data-auto-animate -->
<div class="fragment">
It depends...🤔
</div>
<div class='left' style='float:left;width:400px; font-size: 60px'>
  <pre><code data-trim data-noescape class="scala">
  // program 1  
  val a = &lt;expr&gt;
  (a, a)
  </code></pre>
</div>

<div class='right' style='float:right;width:400px; font-size: 60px'>
 <pre><code data-trim data-noescape class="scala">
  // program 2
  (&lt;expr&gt;, &lt;expr&gt;)
  </code></pre>
</div>


## Are these the same?
<!-- .slide: data-auto-animate -->
<div class="fragment">
Yes 🤩
</div>
<div class='left' style='float:left;width:400px; font-size: 60px'>
  <pre><code data-trim data-noescape class="scala">
  // program 1  
  val a = 42
  (a, a)
  </code></pre>
</div>

<div class='right' style='float:right;width:400px; font-size: 60px'>
 <pre><code data-trim data-noescape class="scala">
  // program 2
  (42, 42)
  </code></pre>
</div>


## Are these the same?
<!-- .slide: data-auto-animate -->
<div class="fragment">
No 😩
</div>
<div class='left' style='float:left;width:480px; font-size: 48px'>
  <pre><code data-trim data-noescape class="scala">
  // program 1  
  val a = print("hi")
  (a, a)
  </code></pre>
</div>

<div class='right' style='float:right;width:480px; font-size: 48px'>
 <pre><code data-trim data-noescape class="scala">
  // program 2
  (print("hi"), print("hi"))
  </code></pre>
</div>


## Are these the same?
<!-- .slide: data-auto-animate -->
<div class="fragment">
No 😩
</div>
<div class='left' style='float:left;width:480px; font-size: 48px'>
  <pre><code data-trim data-noescape class="scala">
  // program 1  
  val a = iter.next()
  (a, a)
  </code></pre>
</div>

<div class='right' style='float:right;width:480px; font-size: 48px'>
 <pre><code data-trim data-noescape class="scala">
  // program 2
  (iter.next(), iter.next())
  </code></pre>
</div>


## Are these the same?
<!-- .slide: data-auto-animate -->
<div class="fragment">
It depends... 🤔
</div>
<div class='left' style='float:left;width:480px; font-size: 46px'>
  <pre><code data-trim data-noescape class="scala">
  // program 1  
  val a = Array(1,2,3)
  (a, a)
  </code></pre>
</div>

<div class='right' style='float:right;width:480px; font-size: 46px'>
 <pre><code data-trim data-noescape class="scala">
  // program 2
  (Array(1,2,3), Array(1,2,3))
  </code></pre>
</div>

---

## The Problem
- Previous examples contain side effects
- Each time we were forced to think about side effects
- Result: <!-- .element: class="fragment" -->
  - Hard to reason about the code
  - Hard to debug
  - Hard to test
  - Silly bugs in production

---

## What if I tell you there is another way...? 
<!-- .element: style="color: white; border: 10px; border-color: black;" -->

<!-- .slide: data-background="https://media.giphy.com/media/Tt9jctxaVjRny/giphy.gif" -->

---

## Effect Management
- Functional effect: turning a **computation** to a first-class value.
  - **Effect** is about doing something 
    - e.g., `println("hi")`
  - **Functional Effect** is a description of an operation.
- Effect management system: <!-- .element: class="fragment" -->
  - A mechanism for managing and executing effects.
  - Enables deterministic results.
  - Enables much more testable code (!)

---

# Enter ZIO ❤️
- Zero-dependency library for effect management.
- Enables writing async and concurrent programs.
- Uses a pure functional approach.
- `=>` Scalable, resilient and reactive applications.


## The most important slide
<div style="font-size: 80px;">
<pre><code class="scala">
ZIO[R,E,A]
</code></pre>
</div>

- R: Requirements the effect needs to run
- E: Failure type (how the effect can fail)
- A: Success type (what the effect returns)
- Similar to  `R => Either[E,A]`


## Everything is ZIO
```scala
Option[A] == ZIO[Any, None, A]

Try[A]    == ZIO[Any, Throwable, A]

Future[A] == ZIO[ExecutionContext, Throwable, A]
```


## Composition is everywhere!
```scala
for {
  a <- ZIO.succeed(42)
  b <- ZIO.fromOption(Some(42))
  c <- ZIO.fromTry(Try(42))
  d <- ZIO.fromFuture(Future(42))
} yield {
  a + b + c + d
}
```

---

## Demo
<!-- .slide: data-background="https://media.giphy.com/media/UrEQirmnMPxBwToULv/giphy.gif" -->

---

# Questions <!-- .element: style="color: white; border: 10px; border-color: black;" -->
<!-- .slide: data-background="https://thehomebasedmom.com/wp-content/uploads/2019/05/Frequently-Asked-Questions.jpg"  data-background-opacity="0.7" -->

---

<!-- .slide: data-background="https://media.giphy.com/media/Pnh0Lou03fv92J4puZ/giphy.gif" data-background-size="50%" -->
