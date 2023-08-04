<!-- # Scala 101 -->
<img src="https://miro.medium.com/v2/resize:fit:1358/1*QtOyg7rBOnuPU0tehyNt7w.jpeg">
<!-- <img src="https://media.giphy.com/media/MGdfeiKtEiEPS/giphy.gif"> -->

### Matan Keidar

---

## By the end of this day, you will:
- Know how to read Scala <!-- .element: class="fragment" -->
- Know how to write Scala <!-- .element: class="fragment" -->
- Understand the arrows <!-- .element: class="fragment" -->
  - (Chen D.) <!-- .element: class="fragment" -->
- Know common patterns in Scala <!-- .element: class="fragment" -->

- We will not cover Wix framework stuff <!-- .element: class="fragment" -->

---

## (Very) Short Intro To JVM
- JVM: Java Virtual Machine <!-- .element: class="fragment" -->
- Source code is compiled to byte-code <!-- .element: class="fragment" -->
- JVM interprets compiled bytecode and executes it <!-- .element: class="fragment" -->
- Result: interoperabilty between JVM languages <!-- .element: class="fragment" -->
- Great optimizations in runtime (JIT) <!-- .element: class="fragment" -->
- Many JVM vendors (e.g., OpenJDK, HotSpot, Azul) <!-- .element: class="fragment" -->

---

## Why Scala?
- Best of all worlds <!-- .element: class="fragment" -->
  - Battle-tested JVM optimizations (~25 years)
  - Modern language and advanced features
- Both OOP and Functional <!-- .element: class="fragment" -->
  - Developer is free to choose
- Scalable language <!-- .element: class="fragment" -->
  - Scripting, infras and even FE
  - Concurrent and async apps
- Big data pipelines (Spark) <!-- .element: class="fragment" -->
  - 🤮 <!-- .element: class="fragment" -->

---

## Let's start!
<img src="https://media.giphy.com/media/8boWfbwJLF33bVtedW/giphy-downsized-large.gif">


<!-- .slide: data-auto-animate -->
## Variables <!-- .element: data-id="title" -->
```scala 
// these are the same
var a: String = "hello"
var a = "hello"
``` 
<!-- .element: class="fragment" -->

``` scala
// mutable
var a = "hello"
a = "world"
``` 
<!-- .element: class="fragment" -->

```scala
// does not compile
var a = "hello"
a = 5
``` 
<!-- .element: class="fragment" -->


<!-- .slide: data-auto-animate -->
## Values <!-- .element: data-id="title" -->
```scala
// These are the same
val a: String = "hello"
val a = "hello"

// does not compile
val a: String = 5

// does not compile
a = "world"
```


<!-- .slide: data-auto-animate -->
## Definitions <!-- .element: data-id="title" -->
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

### special case of Tuple-2 <!-- .element: class="fragment" -->
```scala
val t2 = "matan" -> 39 // aka association, same as ("matan", 39)

val numbers = Map(
  "I"   -> 1,
  "II"  -> 2,
  "III" -> 3,
  "IV"  -> 4
)
```
<!-- .element: class="fragment" -->

---

## Loops
```scala
val nums = List(1,2,3)

// for loop
for (n <- 1 to nums.size) { println(n) }
for (n <- nums) println(n)

// while loop
var i = 0
while (i < nums.size) println(num(i))
```

We are functional, do not do it! 😡
<!-- .element: class="fragment" -->

---

<!-- .slide: data-auto-animate -->
## Functions <!-- .element: data-id="title" -->
```scala
def add(x: Int, y: Int) = x + y
def mult(x: Int, y: Int) = {
  x * y
}
```
<!-- .element: data-id="code" -->


<!-- .slide: data-auto-animate -->
## Functions <!-- .element: data-id="title" -->
### Function Objects
```scala
val add1: Int => Int = (x:Int) => x + 1
val add1 = (x:Int) => x + 1
val add1: Int => Int = x => x + 1
val add1: Int => Int = _ + 1

add1(1) == 2
```
<!-- .element: data-id="code" data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000) -->


<!-- .slide: data-auto-animate -->
## Functions <!-- .element: data-id="title" -->
### Argument lists
```scala
def add1(x: Int, y: Int) = x + y
def add2(x: Int)(y: Int) = x + y

add1(1, 2) == 3
add2(1)(2) == 3
```
<!-- .element: data-id="code" data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000)-->


<!-- .slide: data-auto-animate -->
## Functions <!-- .element: data-id="title" -->
### High order functions
- Let's implement HTTP request filters
- Headers are stored lower/upper

```scala
case class Request(method: String, 
                   uri: String, 
                   headers: Map[String, String] = Map(), 
                   content: String = ""
                  )
def isGET(req: Request): Boolean = ???
def isPOST(req: Request): Boolean = ???

def getContentType(req: Request): String = ???
def getReferer(req: Request): String = ???
```
<!-- .element: data-id="code" -->


<!-- .slide: data-auto-animate -->
## Functions <!-- .element: data-id="title" -->
### High order functions
- Let's implement HTTP request filters

```scala
case class Request(method: String, 
                   uri: String, 
                   headers: Map[String, String] = Map(), 
                   content: String = ""
                  )
def isGET(req: Request): Boolean = req.method == "GET"
def isPOST(req: Request): Boolean = req.method == "POST"

def getContentType(req: Request): Option[String] = 
  headers.find(_._1.toLowerCase == "content-type").map(_._2)

def getReferer(req: Request): Option[String] = 
  headers.find(_._1.toLowerCase == "referer").map(_._2)
```
<!-- .element: data-id="code" -->


<!-- .slide: data-auto-animate -->
# Can we do better? <!-- .element: data-id="title" -->


<!-- .slide: data-auto-animate -->
## Functions <!-- .element: data-id="title" -->
### High order functions

```scala
private def methodFilter(method: String)(req: Request) = 
  req.method == method

private def getHeader(name: String)
                     (headers: Map[String, String]) = 
  headers.find(_._1.toLowerCase == name).map(_._2)
         
val isGET: Request => Boolean = methodFilter("GET")
val isPOST: Request => Boolean = methodFilter("POST")

val getContentType: Request => String = getHeader("content-type")
val getReferer: Request => String = getHeader("referer")
```
<!-- .element: data-id="code" -->

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

## Objects
- Class: blueprint of creating instances
- May contain fields and methods

```scala
class Person(first: String, last: String) {
  def greet(): String = s"My name is $first $last!"
}

val matan = new Person("matan", "keidar")
```


## Objects
- Object: a class that has *exactly* one instance
- No constructor!

```scala
object Logger {
  def info(msg: String): Unit = println(s"[INFO] $msg")
}

Logger.info("hello there")
```


## Objects
- Common pattern: factory methods
- Hide class constructor
- Companion object creates class instances

```scala
class Person private (first: String, last: String) {
  def greet(): String = s"My name is $first $last!"
}

object Person {
  def apply(first: String, last: String) = new Person(first = first, last = last)

  object johnDoe = Person(first = "john", last = "doe")
}

val matan = Person("matan", "keidar")
```


## Objects
- Trait: an interface
- Contains abstract members/methods
- Or concrete methods implementation

```scala
trait Greeter {
  def greet(): String
}

class Person(first: String, last: String) extends Greeter {
  override def greet() = s"Greetings, I'm $first!"
}
```


## Objects
- Common pattern: mixins
- Adding capabilities to classes on demand

```scala
trait Airplane {
  def fly(): Unit
}

trait Car {
  def drive(): Unit
}

class Ford extends Car
class Boeing extends Airplane
class Batmobile extends Car with Airplane
```

---

## Case classes/objects
- Like regular classes, but great of data modeling
- Already provides us:
  - Immutability and `copy`
  - Constructor
  - `hashCode`and `equals`
  - `toString`
  - Comparator
  - Great for pattern-matching (later today)


## Case classes/objects
```scala
case class HttpRequest(method: String, 
                       uri: String, 
                       headers: Map[String, String]
                      )

val req1 = HttpRequest("GET", "/hello", Map.empty)

val req2 = req1.copy(uri = "/world", 
                     headers = Map("Content-Length" -> 5)
                     )
```


## Exercise
- Create trait `Ordinal[T]` that defines ordering ops:
  - lt, le, gt, gte
  - Trait should be mixed in with any class
- Hint: how many ops must be defined/abstract?
- Bonus: let's define the ops to be: <, >, <=, >=
  - It's just regular operator overloading

```scala
// Usage example: 
class Person(name: String, age: Int) extends Ordinal[Person] { 
  ???
}
  
val grut = new Person("Grut", 100)
val spiderMan = new Person("Peter Parker", 16)

println(spiderMan < grut)

---

<!-- .slide: data-auto-animate -->
## Basic Effects <!-- .element: data-id="title" -->
- Effect: a value with context <!-- .element: class="fragment" -->
- Represents a computation <!-- .element: class="fragment" -->
- Computations can be wrapped and chained <!-- .element: class="fragment" -->
- Provides semantic information as well <!-- .element: class="fragment" -->
- F[T]: Effect of type F that returns a value of type T  <!-- .element: class="fragment" -->



<!-- .slide: data-auto-animate -->
## Basic Effects <!-- .element: data-id="title" -->
### Option[T]
- Represents emptiness, a value that exists or not 
- `Some[T]`: an existing value
- `None`: an empty value
```scala
val x: Option[Int] = Some(42)
val y: Option[Int] = None
```


<!-- .slide: data-auto-animate -->
## Basic Effects <!-- .element: data-id="title" -->
### Try[T]
- Represents a computation that can fail
- `Success[T]`: successful result of the computation
- `Failure[Throwable]`: failed computation

```scala
val x: Try[String] = Success("Hello There")
val y: Try[String] = Fail(new RuntimeException("Boom!!!"))

def div(x: Int, y: Int): Try[Int] = Try { x / y }
```


<!-- .slide: data-auto-animate -->
## Basic Effects <!-- .element: data-id="title" -->
### Either[S, T]
- A computation that can return either `S` or `T`
- But NOT both!
- `Right[T]` or `Left[T]`
- Usually, left side represents failure
```scala
val x: Either[Int, String] = Right("Hello There")
val y: Either[Int, String] = Left(-1)
```


<!-- .slide: data-auto-animate -->
## Basic Effects <!-- .element: data-id="title" -->
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

<!-- .slide: data-auto-animate -->
## Basic Functional Programming  <!-- .element: data-id="title" -->

### Goal <!-- .element: class="fragment" -->
Write defensive code with minimal lines of code <!-- .element: class="fragment" -->

### Question <!-- .element: class="fragment" -->
Call findUser and print the retrieved user if exists <!-- .element: class="fragment" -->

```scala
case class User(
  id: String, 
  name: String, 
  manager: Option[User] = None
)

def findUser(id: String): Option[User]
```
<!-- .element: class="fragment" -->


<!-- .slide: data-auto-animate -->
## Basic Functional Programming  <!-- .element: data-id="title" -->
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


## Can we do better?  <!-- .element: data-id="title" -->
<img src="https://media.giphy.com/media/TNO6mwK8s38vpHjh8Y/giphy.gif"> <!-- .element: class="fragment" -->


<!-- .slide: data-auto-animate -->
## Basic Functional Programming  <!-- .element: data-id="title" -->
### map
Traverse each element and apply a function
```scala
val myList = List(1,2,3,4)

// myList.map(f: A => B)

myList.map(x => x * 2) // List(2,4,6,8)
myList.map(_ * 2) // same
```


<!-- .slide: data-auto-animate -->
## Basic Functional Programming  <!-- .element: data-id="title" -->
### flatMap
Same as map, but `f` returns value wrapped with context

```scala
val myList = List(1,2,3,4)

myList.flatMap(x => List(x, x)) // List(1,1,2,2,3,3,4,4)
```


<!-- .slide: data-auto-animate -->
## Basic Functional Programming  <!-- .element: data-id="title" -->
### filter
Choose which elements are passed through 

```scala
val myList = List(1,2,3,4)

myList.filter(x => x % 2 == 0) // List(2,4)
myList.filter(_ % 2 == 0) // same
```


<!-- .slide: data-auto-animate -->
## Basic Functional Programming  <!-- .element: data-id="title" -->
### reduce
Combine all elements to a single value

```scala
val myList = List(1,2,3,4)

myList.reduce{ case (a, b) => a + b}
myList.reduce(_ + _)
// returns 10
```


<!-- .slide: data-auto-animate -->
## Basic Functional Programming  <!-- .element: data-id="title" -->
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


<!-- .slide: data-auto-animate -->
## Basic Functional Programming  <!-- .element: data-id="title" -->
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


<!-- .slide: data-auto-animate -->
## Basic Functional Programming  <!-- .element: data-id="title" -->
How to return a managers id list?
```scala
case class User(
  id: String, 
  name: String, 
  manager: Option[User] = None
)

def findUser(id: String): Option[User]

val userIds: List[String] = ???
```


<!-- .slide: data-auto-animate -->
## Basic Functional Programming  <!-- .element: data-id="title" -->
How to return a managers id list?

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
- Chains of functional combinators are cumbersome <!-- .element: class="fragment" -->
- Syntactic sugar for flatMap/map/filter <!-- .element: class="fragment" -->
- Has to be on the same "Monad" <!-- .element: class="fragment" -->
  - i.e., operate on same type
- Very useful for sequential flows! <!-- .element: class="fragment" -->

```scala
for {
  userId  <- userIds
  user    <- findUser(userId)
  if user.manager.isDefined // just to show if example
  manager <- user.manager
} yield manager.id
```
<!-- .element: class="fragment" -->


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


## Basic Functional Programming
### Examples
<p float="left">
  <pre style="font-size: 70%; width: fit-content;">
    <code class="Scala" data-trim>
        List(🐮, 🥔, 🐔, 🌽).map(cook) ==
    </code>
  </pre>  
  <pre style="font-size: 70%; width: fit-content;">
    <code class="Scala fragment" data-trim>
        List(🍔, 🍟, 🍗, 🍿)
    </code>
  </pre>
</p>


## Basic Functional Programming
### Examples
<p float="left">
  <pre style="font-size: 70%; width: fit-content;">
    <code class="Scala" data-trim>
        List(🍔, 🍟, 🍗, 🍿).filter(isVegan) ==
    </code>
  </pre>  
  <pre style="font-size: 70%; width: fit-content;">
    <code class="Scala fragment" data-trim>
        List(🍟, 🍿)
    </code>
  </pre>
</p>


## Basic Functional Programming
### Examples
<p float="left">
  <pre style="font-size: 70%; width: fit-content;">
    <code class="Scala" data-trim>
        List(🍔, 🍟, 🍗, 🍿).reduce(eat) ==
    </code>
  </pre>  
  <pre style="font-size: 70%; width: fit-content;">
    <code class="Scala fragment" data-trim>
        💩
    </code>
  </pre>
</p>

---

<!-- .slide: data-auto-animate -->
## Pattern Matching <!-- .element: data-id="title" -->
- One of the most powerful Scala features <!-- .element: class="fragment" -->
- Adopted by other languages <!-- .element: class="fragment" -->
- Switch/case on steroids <!-- .element: class="fragment" -->
- Works both on case classes and primitive types <!-- .element: class="fragment" -->


<!-- .slide: data-auto-animate -->
## Pattern Matching <!-- .element: data-id="title" -->
<pre><code class="r-stretch scala" style="padding=50px; height=100%" >
case class User(id: Int, name: String, manager: Option[User])

val nirzo = User(id = 1,   name = "Nirzo", manager = None)
val dima  = User(id = 100, name = "Dima",  manager = None)
val matan = User(id = 101, name = "Matan", manager = Some(dima))

matan match {
  case User(_, "Nirzo", None) => 
    println(s"user $name does not have a manager")

  case User(id, name, _) if id < 3 => 
    println(s"user $name is a founder!")

  case User(_, name, None) => 
    println(s"user $name does not have manager")
  
  case User(_, name, Some(User(_,manager,_))) => 
    println(s"user $name has manager: $manager")
}
</code></pre>


## Exercise
- Write a function that gets a `WixUser`
- If score > 1000, return "$name you are legend!" 
- If name size is exactly 2 chars, return "fake!"
- If user has more than 3 sites, return "$name, you are a premium"
- if name is "bot" and has more than 4 sites, return "rise of the machines"

```scala
case class WixUser(name: String, score: Int, sites: List[String])

def func(user: WixUser): String = ???
```

---

<!-- .slide: data-auto-animate -->
## Implicit Args <!-- .element: data-id="title" -->
As said, a func can have multiple arg list

```scala
def add(x: Int, y: Int) = x + y // call add(1,2)
def add(x: Int)(y: Int) = x + y // call add(1)(2)
```


<!-- .slide: data-auto-animate -->
## Implicit Args <!-- .element: data-id="title" -->

Let's consider the following use case: 

```scala
def sendGet(url: String, client: Sttp)
def sendPost(url: String, payload: String, client: Sttp)
def sendPut(url: String, payload: String, client: Sttp)
def sendOption(url: String, client: Sttp)
```

The developer has to *explictly* pass the `client`.
```scala
val client = new Sttp("localhost", 8000)

sendGet("/foo", client)
sendPost("/bar", "hello", client)
```


<!-- .slide: data-auto-animate -->
## Implicit Args <!-- .element: data-id="title" -->

- Boilerplate is contained within implicit args
- Focus on business logic itself

```scala
def sendGet(url: String)(implicit client: Sttp)
def sendPost(url: String, payload: String)(implicit client: Sttp)
def sendPut(url: String, payload: String)(implicit client: Sttp)
def sendOption(url: String)(implicit client: Sttp)

implicit val httpClient = new HttpClient("localhost", 8000)

sendGet("/foo")
sendPost("/bar", "hello")
```


<!-- .slide: data-auto-animate -->
## Implicit Functions <!-- .element: data-id="title" -->
- Also known as implicit conversions
- Compiler assistance on steroids

```scala
def func(str: String) = println(s"length = ${str.size}")

val x: Int = 42
func(42) // error! does not type checked
```


<!-- .slide: data-auto-animate -->
## Implicit Functions <!-- .element: data-id="title" -->
```scala
def func(str: String) = println(s"length = ${str.size}")

implicit intToStr(x: Int): String = x.toString

val x: Int = 42
func(42) // output: 2
```


# Very BAD!
# 👿

---

<!-- .slide: data-auto-animate -->
## Extension Methods <!-- .element: data-id="title" -->
- A.K.A Monkey Patching 🐵 <!-- .element: class="fragment" -->
- Provides the best of all worlds: <!-- .element: class="fragment" -->
  - Explicit conversion
  - While having flexibility 


<!-- .slide: data-auto-animate -->
## Extension Methods <!-- .element: data-id="title" -->
## How?
  - Create a class that contains the dynamic behavior
  - Import the class to current scope
  - The compiler auto instantiates the wrapper class
  - Wrapper contains the extension logic  


<!-- .slide: data-auto-animate -->
## Extension Methods <!-- .element: data-id="title" -->
## Example:
Let's extend `Int` type for creating `'*'` strings
```scala
5.stars // output: "*****"
```


<!-- .slide: data-auto-animate -->
## Extension Methods <!-- .element: data-id="title" -->
```scala
implicit class IntOps(x: Int) {
  def stars = x * "*" 
}
```


## Exercise
- Let's revisit the `Ordinal[T]` trait 
- Now, let's implement ordinal logic as extension methods
- Meaning, we cannot directly extend any class
  - In our example `Person` class

---

## Big Exercise
<!-- .slide: data-background="https://media.giphy.com/media/UrEQirmnMPxBwToULv/giphy.gif" -->


## Big Exercise
- Clone repo: https://github.com/matankdr/scala-bazel
- Follow readme
- Enjoy!

<img src="https://www.wix.com/tools/qr-code-generator/_functions/svg/250/000/fff/aHR0cHMlM0ElMkYlMkZnaXRodWIuY29tJTJGbWF0YW5rZHIlMkZzY2FsYS1iYXplbA==">

---

# Questions <!-- .element: style="color: white; border: 10px; border-color: black;" -->
<!-- .slide: data-background="https://thehomebasedmom.com/wp-content/uploads/2019/05/Frequently-Asked-Questions.jpg"  data-background-opacity="0.7" -->

---

<!-- .slide: data-background="https://media.giphy.com/media/Pnh0Lou03fv92J4puZ/giphy.gif" data-background-size="50%" -->
