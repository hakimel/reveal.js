## The magical world of
# Scava
### Matan Keidar
<img src="https://www.scala-lang.org/resources/img/frontpage/scala-spiral.png" width="200" height="200" />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Duke_%28Java_mascot%29_waving.svg/226px-Duke_%28Java_mascot%29_waving.svg.png" width="200" height="200" />

---

## Outline
- What is Scava?
- Effect management
  - Nulls
  - Exceptions
- Statement evaluation (return)
- If statement
- Pattern matching
- Immutability

---

# What is Scava?
<div class="r-stack">
  <span class="fragment fade-out" data-fragment-index="1"><h2>Scava</h2></span>
  <span class="fragment fade-in" data-fragment-index="1"><h2>Scala + Java</h2></span>
</div>

<!-- <span class="fragment" data-fragment-index="2">
Meaning: 
- Writing in Java style and 
- Not fully using Scala's features
</span> -->

- Writing in Java style and <!-- .element: class="fragment" -->
- Not fully using Scala's features <!-- .element: class="fragment" -->

---

# Avoid Nulls


## Avoid NULLs

### Why null is bad?
- Represents "nothing", but without any guarantee <!-- .element: class="fragment" -->
- Can do nothing with it (otherwise, NPE) <!-- .element: class="fragment" -->
- Hard to differ <!-- .element: class="fragment" -->
  - Expected vs. unexpected "nothing" 


## Avoid Nulls
- We would like to: 
  - Use the type-system to represent "nothing"
  - Use it safely
- Effect:  Wrapper/Context of a computation value <!-- .element: class="fragment" -->


## What is an Effect?
- <code><span style="color: yellow;">F</span>[<span style="color: red;">T</span>]</code>
- Computation <span style="color: yellow;">`F`</span> that returns value of type <span style="color: red;">`T`</span>
- Context <span style="color: yellow;">`F`</span> that wraps value of type <span style="color: red;">`T`</span>  


## Avoid Nulls 
- `Option[T]`: effect for representing "nothing"
- Has 2 possible values: <!-- .element: class="fragment" -->
  - `Some[T]` represents a concrete value of type `T`
  - `None` represents an empty value
- Example: <!-- .element: class="fragment" --> 
```scala
val num1: Option[Int] = Some(4) 
val num2: Option[Int] = None    
```
- Nice Scala feature: <!-- .element: class="fragment" -->
  ```scala
  Option(null) == None
  ```


## Avoid Nulls <!-- .slide: data-auto-animate -->
### Bad 😩
```scala
if (person.name != null && person.name == "matan") {
  // do something
}
```


## Avoid Nulls <!-- .slide: data-auto-animate -->
### Better 🙂
```scala
if (Option(person.name) == Some("matan")) {
  // do something
}
```


## Avoid Nulls <!-- .slide: data-auto-animate -->
### Good 😎
```scala
if (Option(person.name).exists(_ == "matan")) {
  // do something
}
```


## Avoid Nulls <!-- .slide: data-auto-animate -->
### Excellent 🤩
```scala
Option(person.name).collect {
  case "matan" =>  {
    // do something
}
```

---

# Exceptions Management


## Exceptions Management
Common Java expcetion management:
```scala
try {
  // unsafe piece of code
} catch (Exception ex) {
  // recover from error
} finally {

}
```
What are the possible problems with this approach?


## Exceptions Management
- We do not know if a function should fail or not <!-- .element: class="fragment" -->
  - Java's checked exceptions are not the way to go...
- Exception management can be done anywhere <!-- .element: class="fragment" -->
  - We do not know who handles the error
- Side effects <!-- .element: class="fragment" -->
  - Throwing exceptions is like breaking the call stack
  - And expensive solution


## Exceptions Management
- `Try[T]` has 2 possible values: 
  - `Success[T]`:  a successful computation of type `T`
  - `Failure[Throwable]`: a failed computation
- Example: <!-- .element: class="fragment" -->
```scala
val num1: Try[Int] = Success(4) 
val num2: Try[Int] = Failure(new Exception("oh my..."))    
```
- Nice Scala feature: <!-- .element: class="fragment" -->
  ```scala
  val result = Try { 5 / 0 }
  println(result) // Failure(ArithmeticException: / by zero)
  ```

---

# Early Returns


### Referential Transparancy
> A piece of code is referentially transparent if 
> we can safely replace
> that piece of code with the value it computes and vice-versa, anywhere where that piece is used, without changing the meaning or result of our program. 


## Early Returns <!-- .slide: data-auto-animate -->
```scala
def isPositiveNumber1(number : Int) : Boolean = {
  val isTrue  = return true
  val isFalse = return false

  if(number > 0) isTrue else isFalse
}

def isPositiveNumber2(number : Int) : Boolean = {
  if(number > 0) return true else return false
}

isPositiveNumber1(-1) // true 😱
isPositiveNumber2(-1) // false
```


## Early Returns <!-- .slide: data-auto-animate -->
The `return` keyword is <span style="color: red;">NOT</span> <span style="color: yellow;">referentially transparent </span>


## Early Returns <!-- .slide: data-auto-animate -->
```java []
int indexOf(String string, char character) {
  if(string.isEmpty()) {
    return -1;
  } else {
    int index = -1;
    int i;
    char[] stringArray = string.toCharArray();
    
    for(i = 0; i <= string.length() - 1; i++){
      if (stringArray[i] == character) return i;
    }

    return index;
  }
}
```
How to implement early returns in Scala?


## Early Returns with Recursion 
```scala []
def indexOf(string : String , char : Char) : Int = {
   @tailrec
   def loop(stringList: List[Char], index: Int) : Int = {
     stringList match {
       case Nil => -1
       case h :: _ if h == char => index + 1
       case _ :: t => loop(t , index + 1)
     }
   }
   
   if(string.isEmpty) -1 else loop(string.toList, -1)
```

---

# Abusing If statements 


## Abusing If statements
```scala []
def findUser(id: Int): Option[User] = ???

val res: Option[User] = findUser(id = 1)

res.map(user => user.name)
res.exists(_.name.size > 4) // excludes vacuous truth
res.forall(_.name.size > 4) // includes vacuous truth
res.foreach(println) // signal for a side effect
res.fold("empty-user")(_.name) // if-else
res.contains(User("matan")) // compare
```

---

# Absusing Pattern Matching


## Absusing Pattern Matching
- Pattern matching is a great tool
- Switch-case on steroids
- Provides simplicity 
- However, new Scala developers tend to overuse it


## The basic rule
Check if there is a variable binding


## Example (bad)
```scala
val user = User(1, "matan")

user match {
  case u if u.id == 1 => // do something
  case u if u.id < 10 => // do something else
  case other => // do something completly different
}

if (user.id == 1) // do something
else if (user.id < 10) // do something else
else // do something completly different


## Example (Good)
```scala
val user = User(1, "matan")

if (user.id == 1 && user.name == "matan") // do something
else if (user.id < 10 ) // do something else
else // do something completly different

user match {
  case User(1, "matan") => // do something
  case User(id, _) if id < 10 => // do something else
  case other => // do something completly different
}

```

---

# Immutability


## Immutability <!-- .slide: data-auto-animate -->
- A common pattern is to create an empty collection 
- And then populate it with values
- Why is it bad?
  - Not thread safe <!-- .element: class="fragment"  -->
  - Harder to reason about the code <!-- .element: class="fragment"  -->
- How to avoid it? <!-- .element: class="fragment"  -->


## Immutability <!-- .slide: data-auto-animate -->
```scala
val users: List[User] = getAllUsers()

var managers = List.empty[User]

// Imperative
users.foreach { user => 
  if (user.isManager) {
    managers += user
  }
}

// Functional
val managers = users.filter(_.isManager)
```


## Immutability <!-- .slide: data-auto-animate -->
```scala
// Imperative
var onePerRegion: Map[Region, User] = Map()
users.foreach { user => 
  if (!onePerRegion.contains(user.region)) {
    onePerRegion += (user.region -> user)
  }
}
```


## Immutability <!-- .slide: data-auto-animate -->
```scala
// Functional
val onePerRegion = users.foldLeft( (Seq.empty[User], "") ) {
  case ((agg, region), user) if user.region != region => 
    (agg + user, user.region)

  case ((agg, region), _) =>   
    (agg, region)
}
```


## Immutability <!-- .slide: data-auto-animate -->
- Always try to use an existing "builder" 
  - `toMap`, `toList`, `toSeq`, `toSet`

  ```scala
  users.map(user => (user.age -> user) )
  .toMap
  ```

- Or, manipulate an existing collection 


## Immutability: pros vs. cons
- Pros: 
  - Simple model 
    - Easier to reason about
    - Easier to refactor
  - Thread safety
  
- Cons: 
  - Increase memory consumption
  - GC works harder

---

# Scala/Java Converters


## Collection Converters
```scala
import scala.jdk.CollectionConverters._

val jList = java.util.List.of(1,2,3)
val sList = jList.asScala // there is also asJava
```


## Option Converters
```scala
import scala.jdk.CollectionConverters._

val sOption = Option(4)
val jOption = sOption.toJava // there is also toScala
```


## Another converter classes
- <span style="color: yellow;">`DurationConverters`</span>
  - converts between Scala and Java duration types
- <span style="color: yellow;">`FutureConverters`</span>
  - converts between Scala `Future` and Java `CompletionStage`
- <span style="color: yellow;">`FunctionConverters`</span>
  - converts between Scala and Java function types
- <span style="color: yellow;">`StreamConverters`</span>
  - converts between Scala and Java stream types  

---

# Implicits


## Implicits
- Scala 2 uses `implicit` keyword for 2 mechanisms:
  - Implicit arguments
  - Implicit functions/conversions
- We will explore both of them


## Implicit Arguments <!-- .slide: data-auto-animate -->
```scala
// single argument list
def add(x: Int, y: Int) = x + y

add(1,2) == 3

// multiple argument lists
def add(x: Int)(y: Int) = x + y

add(1)(2) == 3
```


## Implicit Arguments <!-- .slide: data-auto-animate -->
```scala []
// multiple argument lists
def add(x: Int)(implicit y: Int) = x + y

add(1)(2) == 3 // explicit call (same as before)

implicit val magic = 2
add(1) == 3 // implicit call
```


## Implicit Arguments <!-- .slide: data-auto-animate -->
- The compiler assigns the implicit args by itself
  - Implicit args must exist in scope
  - Otherwise, complication error
- Great for creating nice DSLs
- No magic...


## Implicit Arguments <!-- .slide: data-auto-animate -->
Improves code readability
```scala
// explicit
def get(url: String, conn: Connection)
def post(url: String, payload: Array[Byte], conn: Connection)

// usage
get("http://example.org", conn)
post("http://example.org", "payload".getBytes, conn)
```


## Implicit Arguments <!-- .slide: data-auto-animate -->
Improves code readability
```scala
// implicit
def get(url: String)(implicit conn: Connection)
def post(url: String, payload: String)
        (implicit conn: Connection)

// usage
implicit val conn: Connection = ???
doGet("http://example.org")
doPost("http://example.org", "payload".getBytes)
```


## Implicit Conversions 
- Implicits mechanism is very powerful
- Also works on functions

```scala
case class Person(name: String, age: Int)
implicit def personToString(p: Person) = s"${p.age}-${p.name}"

def print(s: String) = println(s)

val p = Person("Matan", 37)
print(p) // type checked!!!
```


## Implicit Conversions <!-- .slide: data-auto-animate -->
- DO NOT DO IMPLICIT CONVERSIONS
- Might cause lots of troubles
- Interrupt reasoning about the code

```scala
implicit def str2int(str: String): Int = Integer.parseInt(str)

"foo" / 2 // this code compiles but fails at runtime
```

---

# Extension Methods


## Extension Methods <!-- .slide: data-auto-animate -->
- Goal: add a new behavior to an existing type
- Inheritence: OOP way to add a new behavior
- Let's add a new behavior to `scala.lang.Int`
  - add method to return `*` characters
- Can we inherit an Int?


## Extension Methods <!-- .slide: data-auto-animate -->
- Let's write an extension method instead
```scala
  implicit class RichInt(i: Int) {
    def stars = '*' * i
  }

  5.stars == "*****"
```
- Preferable over implicit conversions
  - Easier to reason about
- When applied correctly, provides a nice DSL  

---

# Futures


## Futures
`Future[T]` 
- Effect that represents async computation
  - That is <span style="color: yellow;">already running</span> and will be completed
- Can succeed with value of type `T`
- Can fail with value of type `Throwable`


## A Future is NOT Thread <!-- .slide: data-auto-animate -->
- Future is an abstraction of async computation
- It is executed within an `ExecutionContext`
  - Which wraps a thread pool
- The developer is able to choose the context

```scala
object Future {
  def apply[T](body: => T)
              (implicit ec: ExecutionContext): Future[T]
}
```


## A Future is NOT Thread <!-- .slide: data-auto-animate -->
```scala
import scala.concurrent._
import scala.concurrent.ExecutionContext.Implicits.global

Future(42) // represents an async computation that returns 42
```


## Useful Future Operations <!-- .slide: data-auto-animate -->
```scala
val f1: Future[Int] = ???
val f2: Future[Int] = ???

// register to callbacks
f1.flatMap(x => f2.map(y => x + y)) 

// syntactic sugar
for {
  x <- f1
  y <- f2
} yield x + y
```


## Useful Future Operations <!-- .slide: data-auto-animate -->
```scala
val f1: Future[Int] = ???
val f2: Future[Int] = ???

// waiting for all futures to complete
val futures: List[Future[Int]] = List(f1, f2)
val result: Future[List[Int]] = Future.sequence(futures)
```


## Useful Future Operations <!-- .slide: data-auto-animate -->
```scala
val f1: Future[Int] = ???
val f2: Future[Int] = ???

// racing futures
Future.firstCompleteOf(List(f1, f2))
```


## Useful Future Operations <!-- .slide: data-auto-animate -->
```scala
val f: Future[Int] = ???

// callbacks with side effect
f.onComplete {
  case Success(value) => // do something
  case Failure(err)   => // handle failure
}
```


## Awaiting for futures
```scala
import scala.concurrent.duration._

val f: Future[Int] = ???

// block future until completion, or timeout
val result: Int = Await.result(f, 10.seconds)
```

- Blocking on futures is BAD
  - Heavily impacts application performance
- Future is an effect just like other effects
  - Should be rolled over to next stage


## Blocking on futures <!-- .slide: data-auto-animate -->
- Sometimes we have to work with blocking IO
  - Usually legacy APIs
  - Not CPU bound
- We do not like to keep the thread waiting on IO
- We would like to: 
  - Block the thread
  - And "remove" it from the CPU


## Blocking on futures <!-- .slide: data-auto-animate -->
```scala []
def foo(x: Int): Future[Unit] = 
  Future {
    blocking {
      println(s"starting $x")
      Thread.sleep(3000)
      println(s"ending $x")
    }
  }

for {
  x <- 1 to 50
} yield foo(x) 
```


## Future And Promises <!-- .slide: data-auto-animate -->
- A future is linked with extactly one `promise` object
- A `promise` allows us to complete a future
  - Can be done at most one time
- In other words:
  - We can impact a future result via a worm hole
  - `promise -> future`


## Future And Promises <!-- .slide: data-auto-animate -->
```scala
case class TaxCut(reduction: Int)
case class LameExcuse(msg: String) extends Exception(msg)

val taxcut = Promise[TaxCut]()
val taxcutF: Future[TaxCut] = taxcut.future
```


## Future And Promises <!-- .slide: data-auto-animate -->
```scala 
object Government {
  def redeemCampaignPledge(): Future[TaxCut] = {
    val p = Promise[TaxCut]()
    
    Future {
      println("Starting the new legislative period.")
      Thread.sleep(2000)
      p.success(TaxCut(20))
      println("We reduced the taxes! You must reelect us!!!!")
    }

    p.future
  }
}
```


## Future And Promises <!-- .slide: data-auto-animate -->
```scala
object Government {
  def redeemCampaignPledge(): Future[TaxCut] = {
    val p = Promise[TaxCut]()
    Future {
      println("Starting the new legislative period.")
      Thread.sleep(2000)
      p.failure(LameExcuse("global economy crisis"))
      println("We didn't fulfill our promises")
    }
    
    p.future
  }
}
```


## Exercise
- Actor version
  - How to implement ask pattern?

- Non Actor version
  - Given a function `def f(x: Int): Future[Int]`
  - And a blocking function: `def g(x: Int): Int`
  - How to call g from f without wrapping with Future?

---

# Exercise


## Exercise
https://github.com/matankdr/scala-finder-refactoring-kata

<img src='https://chart.googleapis.com/chart?cht=qr&chl=https%3A%2F%2Fgithub.com%2Fmatankdr%2Fscala-finder-refactoring-kata&chs=180x180&choe=UTF-8&chld=L|2' alt='qr code'><a href='https://www.qr-code-generator.com' border='0' style='cursor:default'  rel='nofollow'></a>

---

# Variable Types


## Variable Types
- In Scala, there are multiple variable types
- `var`: mutable reference (variable)
- `val`: immutable reference (value, like `final` in Java)
- `def`: the expression is re-evaluated on each call


## Variable Types
```scala
var x: Int = 1
x = 2 // ok

val y: Int = 1
y = 2 // compilation error
```


## Variable Types
```scala
def z: Unit = println("hello world")

z()
z()
// hello world
// hello world

val z: Unit = println("hello world")

z()
z()
// hello world
```


## Variable Types
```scala 
lazy val x = { println("init x"); 1 }

val y = { println("init y"); 2}

println(y)
println(x)

// init y
// 2
// init x
// 1
```

---

# Functions as Objects


## Functions as Objects
- In Scala, functions are first class citizens
- Which means, function has a type and can be stored as a value
```scala
val salaries = Seq(20000, 70000, 40000)
val doubleSalary: Int => Int = (x: Int) => x * 2
val newSalaries = salaries.map(doubleSalary)
```


## Functions as Objects
```scala
// the following are equivalent
val doubleSalary1: Int => Int = (x: Int) => x * 2
val doubleSalary2: Int => Int = x => x * 2
val doubleSalary3: Int => Int = _ * 2
val doubleSalary4 = (x: Int) => x * 2
```


## Functions as Objects <!-- .slide: data-auto-animate -->
We can even extend functions

```scala
trait Set[T] extends (T => Boolean) {
  
}
```


## Functions as Objects <!-- .slide: data-auto-animate -->
We can even extend functions

```scala
trait Set[T] extends (T => Boolean) {
  def apply(elem: T): Boolean = this.contains(elem)
}
```


## High Order Functions
- We can define a function that accepts a function
```scala
def doSomething(s: String, f: String => String) = 
    f(s.toUpperCase)
```
- Why is it useful? 
  - Common FP constructs: map, flatMap, filter <!-- .element: class="fragment"  -->
  - Code re-use (DRY) <!-- .element: class="fragment"  -->


## High Order Functions <!-- .slide: data-auto-animate -->
### Currying

```scala
// all versions are logically equivalent
def mult(x: Int, y: Int): Int = x * y
def mult(x: Int)(y: Int): Int = x * y
```


## High Order Functions <!-- .slide: data-auto-animate -->
### Currying

```scala
def mult(x: Int)(y: Int): Int = x * y
def makeDouble = mult(2) _
def makeTriple = mult(3) _

makeTriple(4) // 12
```


## High Order Functions <!-- .slide: data-auto-animate -->
### Currying
Same as
```scala
val mult = (x: Int) => (y: Int) => x * y
val makeTriple = mult(3)

makeTriple(4) // 12
```


## High Order Functions
Let's implement HTTP headers filter:

```scala
def internalFind(key: String)(headers: Map[String, String]) = 
  headers.find(key)

// HTTP header filters
def getContentType = internalFind("Content-Type") _
def getUserAgent   = internalFind("User-Agent") _
def getHost        = internalFind("Host") _
```


## High Order Functions <!-- .slide: data-auto-animate -->
### Composition
```scala
val f: Int => Int = _ + 1
val g: Int => Int = _ * 2

val h = f andThen y
h(3) // g(f(3) == 8
```


## High Order Functions <!-- .slide: data-auto-animate -->
### Composition
```scala
val f: Int => Int = _ + 1
val g: Int => Int = _ * 2

val h = f compose y
h(3) // f(g(3)) == 7
```


## High Order Functions <!-- .slide: data-auto-animate -->
### Composition
Let's implement email predicate system
```scala
val mails = List(
  Email(
    subject = "It's me again, your stalker friend!",
    text = "Hello my friend! How are you?",
    sender = "johndoe@example.com",
    recipient = "me@example.com"
  )
)

type EmailFilter = Email => Boolean
def not[T](pred: T => Boolean) = (t: T) => !pred(t)
```


## High Order Functions <!-- .slide: data-auto-animate -->
### Composition

```scala
def newMailsForUser(mails: Seq[Email], f: EmailFilter) = 
  mails.filter(f)

val sentByOneOf: Set[String] => EmailFilter = 
  senders => email => senders.contains(email.sender)

val notSentByAnyOf: Set[String] => EmailFilter = 
  senders => email => !senders.contains(email.sender)

val maximumSize: Int => EmailFilter = 
  n => email => email.text.size <= n  
```


## High Order Functions <!-- .slide: data-auto-animate -->
### Composition

```scala
def any[A](preds: (A => Boolean)*): A => Boolean = 
  a => preds.exists(pred => pred(a))

def none[A](preds: (A => Boolean)*) = 
  not(any(preds: _*))

def every[A](preds: (A => Boolean)*) = 
  none(preds.map(not(_)): _*)
```


## High Order Functions <!-- .slide: data-auto-animate -->
### Composition

```scala
val notSentByAnyOf = sentByOneOf andThen(not(_))
```


## Partial functions

```scala
val squareRoot = new PartialFunction[Double, Double] {
  override def isDefinedAt(x: Double): Boolean = x >= 0
  override def apply(x: Double): Double = Math.sqrt(x)
}

val squareRoot: PartialFunction[Double, Double] = {
  case x if x >= 0 => Math.sqrt(x)
}
```


## Partial functions
```scala
val squareRoot: PartialFunction[Double, Double] = {
  case x if x >= 0 => Math.sqrt(x)
}

val abs: PartialFunction[Double, Double] = {
  case x if x >= 0 =>  x
  case x           => -x
}

val f = squareRoot orElse abs
f(4.0) // 2
f(-3)  // 3

val g = abs andThen squareRoot
g(-4) // 2
```

---

// type classes
// what is the pattern, why
// comparator type class
// encryptor type class

---


# Typesafe Config


## Typesafe Config
- Configuration library for JVM languages
- Implemented in plain Java with no dependencies
- Supported formats: Json, Hocon, Java properties
- Can load from: files, URLs or classpath
- Good support for:
  - Nesting (subtree of config is a whole config)
  - Overriding config settings
  - Parsing properties


## Typesafe Config
```scala
// basic usage
val config = ConfigFactory.parseString(s"""
     |hello : world
     |foo : 1
     |""".stripMargin
)

config.getString("hello") // "world"
config.getInt("foo") // 1
```


## Config files
- A single `application.conf` (per executable)
- Multiple `reference.conf` files
- All `reference.conf` files are resolved
  - To a single config tree
- `application.conf` overrides unresolved settings
- Each conf file should be self-contained
  - Don't leave unset value to `application.conf`


## Merging Config Trees
```scala
config1.withFallback(config2)
```


## Overrding Default Config File
```bash
java -jar app.jar -Dconfig.file=path/to/config/file
```


# Overriding config settings


-Dconfig.file
overriding properties


hocon plugin
click on config
CMD option shift c
click in 
