## The Art of
# Clean Code

<!-- Put the link to this slide here so people can follow -->
slide: https://hackmd.io/p/template-Talk-slide

---

## Based on

<img src="https://images-na.ssl-images-amazon.com/images/I/51b7XbfMIIL.jpg" width="40%">

---

# Overview
- Why clean code matters?
- Names
- Functions
- Classes
- Comments

---

## Why clean code matters?

<img src="https://i2.wp.com/commadot.com/wp-content/uploads/2009/02/wtf.png?w=550&ssl=1">

---

# Clean Code
- Does one thing very *well*
- Reads like a well written prose (cliché but true)
- Was written by someone who cared
- <span style="color:green">Easy</span>: write a code that a computer understands
- <span style="color:red">Hard</span>: write a code that a human can understand

---

## Clean Code Matters
True cost of software == its maintenance

<img src="https://www.researchgate.net/profile/Eduardo_Franco11/publication/306363434/figure/fig3/AS:397858684588035@1471868310610/Software-product-maintainability-behavior-over-time.png" height=10% width=80%>

----

# Clean Code Matters
We READ 10x more time than we WRITE

Boyscout rule: 
Always check cleaner code than you found

---

# Naming

----

## Functions

- Functions are verbs
    - `product(), transaction()` <!-- .element: class="fragment strike" -->
    - `searchProduct(), doTransaction()` <!-- .element: class="fragment" -->
- <!-- .element: class="fragment" --> Boolean names should answer yes/no:
    - `isGoldClient()`
    - `isHostValid()`

----

## Classes
- Classes are nouns
    - Customer, OrderDetails, OrderFacade
    
- Avoid meaningless names
    - ~~`OrderInfo`~~, ~~`OrderData`~~
    - `Order`
- Delete the interfaces:
    - ~~`ICustomerService`~~, ~~`OrderServiceImpl`~~

----

## How do you understand a function?
- From comments?
- From its implementation?

You should NOT need to do that!

Make the name speak for itself!

----

## Do you think you found a better name?
# Rename it! <!-- .element: class="fragment" style="color:yellow" -->

It takes a few seconds in your IDE <!-- .element: class="fragment" -->

----

### Names should be pronounceable
`getIntCdtLmt()` <!-- .element: class="fragment strike" data-fragment-index="1"-->
`getInvoiceableCreditLimit()` <!-- .element: class="fragment" data-fragment-index="2"-->

### Avoid abbreviations! <!-- .element: class="fragment" data-fragment-index="3" -->
Unless it's a basic business concept  (like VAT) <!-- .element: class="fragment" data-fragment-index="3" -->

----

### Names should be consistent
`find()`,`fetch()` or `get()`?

Stick to naming conventions

---

# Functions

----

## Single responsibility
> A function should do one thing,
> It should do it well
> and should do it ONLY

Uncle Bob

<span class="fragment">Functions should be <span style="color:red">small</span>!</span>

----

## Functions
### How Small?
- ~10-20 lines <!-- .element: class="fragment" -->
- By any means, smaller than a page of your IDE <!-- .element: class="fragment" -->
- <span> Be sure that they just do <span style="color:red"> one </span> thing </span> <!-- .element: class="fragment" -->

----

## Functions 
### No Boolean parameters
```scala
removeOrders(customer, false, true)
```

### No Nullable parameters
```scala
if (customer != null) {...} else {...}
```

----

## The Null Wars
- <span style="color:red">Avoid</span>: returning `null`
- <span style="color:yellow">Better</span>: throw exception
- <span style="color:green">Best</span>: wrap it with an `Optional`

----

## How to simplify it? 😞
```scala
def stringsToInts(strings: List[String]) = {
    if (strings != null) {
        var integers = List()

        for (s <- strings) {
            integers += Integer.parseInt(s)
        }

        integers
    } else {
        null
    }
}
```

----

## How to simplify it? 😐
```scala
def stringsToInts(strings: List[String]) = {
    if (strings == null) {
        return null
    } 
    
    var integers = List()

    for (s <- strings) {
        integers += Integer.parseInt(s)
    }

    integers
}
```

- Less TABs is easier to read
- Fail the build if 3+ TABs are detected

----

## How to simplify it? 😎
```scala
def stringsToInts(strings: List[String]) = {
    // strings is not null 
    strings.map(Integer.parseInt)
}
```

----

## Descriptive names

### What is the problem?
```scala
val p = Point(1.0, 2.0)
```

```scala
Point(x: Double, y: Double)
Point(r: Double, θ: Double)
``` 
<!-- .element: class="fragment" -->

----

### Solution: factory methods!
```scala
// Perfectly reasonable
val p1 = Point.fromCartesian(1.0, 2.0)
val p2 = Point.fromPolar(3.0, 4.0)
```

----

### Function arguments
- No arguments is the best <!-- .element: class="fragment" -->
- 1 argument is just fine <!-- .element: class="fragment" -->
- 2 arguments are okay <!-- .element: class="fragment" -->
- 3 arguments should be used with really good reason <!-- .element: class="fragment" -->
- 4 arguments is BAD <!-- .element: class="fragment" -->

----

### Function arguments
```scala
// Bad
def makeLine(x0: Double, y1: Double, x1: Double, y1: Double)

// Good
def makeLine(p1: Point, p2: Point)
```

----

### Have no side effects
```scala
def set(attribute: String, value: String) = {
    if (attributeExists("username")) {
        setAttribute("username", "tony.stark")
    }
}
```
<!-- .element: class="fragment fade-in-then-semi-out" -->

```scala
def setAndCheckIfExists(attribute: String, value: String) = {
    if (attributeExists("username")) {
        setAttribute("username", "tony.stark")
    }
}
```
<!-- .element: class="fragment" -->

----

### D.R.Y (Do not repeat yourself)
- Why code duplication is bad?
    - Code maintenance
    - Hard to reason about the whole system

----

### D.R.Y 
```scala
def searchUser(request: Request) = {
    // define http request
    val token = request.token 
    val decoded = ??? // decode token
    
    // code for searching user
}

def updateUser(request: Request) = {
    // define http request
    val token = request.token
    val decoded = ??? // decode token

    // code for updating user
}
```

----

### D.R.Y
Solution: extract common parts as functions

```scala[1|3-6|8-10]
def decodeToken(token: String) = { ... }

def searchUser(request: Request) = {
    val decoded = decodeToken(request.token)
    // code for searching user
}

def updateUser(request: Request) = {
    val decoded = decodeToken(request.token)
    // code for updating user
}
```

---

## Comments

- Comments do not make up for bad code
    - Do not comment bad code, rewrite it!
- Explain yourself in code

- Bad:
<pre><code class="scala" style="width: 700px;" data-trim>
// check if employee is eligible for full benefits
if ( (employee.kind == HOURLY) && (employee.age > 65) )
</code>
</pre>

- Good:
<pre><code class="scala" style="width: 700px;" data-trim>
if ( isEligibleForFullBenefits(employee) )
</code></pre>

----

## Comments = Failures
- Written proof of incompetence
- Comments inevitably get out of sync with the code
    - ```scala
    /* Very important comment from 10 years ago */
    ```
    - In other words: comments LIE!

----

## Comments (good)

### Legal comments
```scala
// Copyright (C) 2020 by Pipl inc. All right reserved.
// Released under the terms of the GNU General Public License.
```

### Informative comments
```scala
// returns an instance of the responder being tested
private val responder = responderInstance()

// format matched hh:mm:ss EEE, MMM dd, yyyy
val timeMatcher = """\d*:\d*:\d* \w*, \w* \d*, \d*""".r
```

----

## Comments (good)
### Clarification comments
```scala
assertTrue(a.compareTo(b) == -1) // a < b
assertTrue(a.compareTo(b) == 1) // a > b
```

----

## Comments (bad)
### Redundant comments
```java
// Utility method that returns when this.closed is true.
// Throws an exception if the timeout is reached
public synchronized waitForClose(timeoutMillis: Long) 
  throws Exception {
  if (!closed) { 
    wait(timeoutMillis);

    if (!closed)
      throw new Exception("MockResponder could not be closed");
    }
  }
}
```

----

## Comments (bad)
### Redundant comments
```scala
// the processor delay for this component
val backgroundProcessorDelay = -1

// the lifecycle event support for this component
val lifecycle: LifecycleSupport = new LifecycleSupport(this)
```

---

# Formatting

----

## Formatting
- The purpose of formatting is <span style="color:red"> communication </span>
- The newspaper metahpor 📰 
  - High level → details
- Vertical openness between concepts
  - Each blank line is a visual cue
  - Identifies a new and a separate concept

----

### Vertical Density
Vertical density implies close association
```scala
// class name of the reporter listener
private val className = ""

// properties of the reporter listener
private val properties = List()
```

----

### Vertical distance
- <!-- .element: class="fragment" --> Variables
  - declared as close to their usage as possible
- <!-- .element: class="fragment" --> Instance Variables
  - should be declared at the top of the class
- <!-- .element: class="fragment" --> Dependent Functions
  - If one function calls another, they should be veritcally close
  - And the caller should be above the called

----

### Vertical distance example
```scala
def measureLine(line: String) = {
    val lineSize = line.size()
    totalChars += lineSize
    lineWidthHistogram.addLine(lineSize, totalChars)
    recordWidestLine(lineSize)
}

def root2(a: Int, b: Int, c: Int) = {
    val determinant = determinant(a, b, c)
    (-b - sqrt(determinant)) / (2*a)
}
```
