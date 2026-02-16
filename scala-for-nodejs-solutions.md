# Scala for Nodejs - Exercises Solutions

### Exercise 1: Pizza

```scala
// Enums for size and crust
sealed trait PizzaSize
case object Small extends PizzaSize
case object Medium extends PizzaSize
case object Large extends PizzaSize

sealed trait CrustType
case object Thin extends CrustType
case object Regular extends CrustType
case object Thick extends CrustType

sealed trait Topping
case object Olives extends Topping
case object Mushrooms extends Topping
case object Peppers extends Topping
case object Onions extends Topping

case class Pizza(crustType: CrustType,
                 pizzaSize: PizzaSize,
                 toppings: List[Topping] = List()) {
  def addTopping(topping: Topping): Pizza =
    this.copy(toppings = toppings :+ topping)

  override def toString: String =
    s"Pizza($pizzaSize, $crustType, toppings: ${toppings.mkString(", ")})"
}

// Usage:
val pizza =
  new Pizza(crustType = Thin, pizzaSize = Large)
    .addTopping(Olives)
    .addTopping(Mushrooms)

println(pizza)
// Pizza(Large, Thin, toppings: Olives, Mushrooms)
```

---

### Exercise 2: Ordinal[T] Trait

Only one abstract method is needed (compare or lt). All others derive from it.

```scala
trait Ordinal[T] {
  def compare(other: T): Int // the single abstract method

  def <(other: T): Boolean = compare(other) < 0

  def >(other: T): Boolean = compare(other) > 0

  def <=(other: T): Boolean = compare(other) <= 0

  def >=(other: T): Boolean = compare(other) >= 0
}

case class Person(name: String, age: Int) extends Ordinal[Person] {
  override def compare(other: Person): Int = this.age - other.age
}

val grut = Person("Grut", 100)
val spiderMan = Person("Peter Parker", 16)

println(spiderMan < grut) // true
println(spiderMan > grut) // false
println(grut >= grut) // true

```

---

### Exercise 3: WixUser Pattern Matching

```scala
case class WixUser(name: String, score: Int, sites: List[String])

def func(user: WixUser): String = user match {
  case WixUser(name, score, _) if score > 1000 =>
    s"$name you are legend!"

  case WixUser(name, _, _) if name.length == 2 =>
    "fake!"

  case WixUser("bot", _, sites) if sites.size > 4 =>
    "rise of the machines"

  case WixUser(name, _, sites) if sites.size > 3 =>
    s"$name, you are a premium"

  case _ =>
    "regular user"
}

// Examples:
println(func(WixUser("Alice", 1500, List()))) // Alice you are legend!
println(func(WixUser("AB", 50, List()))) // fake!
println(func(WixUser("bot", 10, List("a", "b", "c", "d", "e")))) // rise of the machines
println(func(WixUser("Bob", 100, List("a", "b", "c", "d")))) // Bob, you are a premium
```

Note: Order matters — the "bot" check must come before the general "more than 3 sites" check, otherwise "bot" with 5 sites would match the premium case first.

---

### Exercise 4: Ordinal as Extension Methods

```scala
// The trait defines what "comparable" means
trait Comparable[T] {
  def compare(a: T, b: T): Int
}

// Extension method via implicit class
implicit class OrdinalOps[T](val self: T) extends AnyVal {
  def <(other: T)(implicit ord: Comparable[T]): Boolean = ord.compare(self, other) < 0

  def >(other: T)(implicit ord: Comparable[T]): Boolean = ord.compare(self, other) > 0

  def <=(other: T)(implicit ord: Comparable[T]): Boolean = ord.compare(self, other) <= 0

  def >=(other: T)(implicit ord: Comparable[T]): Boolean = ord.compare(self, other) >= 0
}

case class Person(name: String, age: Int)

// Provide the implicit instance for Person
implicit val personOrd: Comparable[Person] = new Comparable[Person] {
  def compare(a: Person, b: Person): Int = a.age - b.age
}

val grut = Person("Grut", 100)
val spiderMan = Person("Peter Parker", 16)

println(spiderMan < grut) // true
println(spiderMan > grut) // false
println(grut >= grut) // true
```
