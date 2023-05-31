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
- partial functions / composition
- functional programming
- basic effects: Option, Try, Either
- pattern matching
- Async (Future vs. promise)
- for comporehension
  - chaining concept

---

## (Very) Short Intro To JVM
- JVM: Java Virtual Machine
- Responsible for interpreting compiled bytecode 
- Result: interoperabilty between JVM languages
- Great optimizations in runtime (JIT)

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

---

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
