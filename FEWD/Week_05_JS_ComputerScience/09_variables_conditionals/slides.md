![GeneralAssemb.ly](../../img/icons/FEWD_Logo.png)

#FEWD - Variables Conditionals

###Instructor Name

Instructors current role.

---


##Agenda

*	Review
*	Variables
*	Conditionals
*	Lab Time

---

##Review

---

##Variables

What are variables?

---


##Variables

*	We can tell our program to remember values for us to use later on.

*	The action of saving a value to memory is called assignment

*	The entity we use to store the value is called a variable

---


##Variables

*	The action of getting the value from a variable is called accessing the variable

*	We will use all the above techniques to store values into variables, and generate new values using existing variables

---

##Variables Declaration

Declaration: ```var age;```

Assignment: ```age = 21;```

Both at the same time: ```var age = 21;```

---

##Variable Re-Assignment

```var name = "Jo";```

```name = Amir;```

Note:

name is now Amir.


---

##Variable Conventions

*	Variables start with a lower case letter

*	If they contain multiple words, subsequent words start with an upper case letter.

		var numberOfStudents = 10;

---

##Variables & Data Types

What can you store in a variables?


Note:

##Data Types

The types of different values we support include:

*	__String__ text
*	__int__, __float__ numbers
*	__Boolean__ true or false

---


![GeneralAssemb.ly](../img/icons/code_along.png)
##Score Keeper

---

##Strings

*	Stores textual information
*	String literal is surrounded by quotes

```"How is the weather today?"```

```'Warm'```

---

##Strings

Double vs single quoted strings:

'They "purchased" it'

"It's a beautiful day"

---

##Strings
Escaping
"They \"purchased\" it"

'It\'s a beautiful day'

---

##Conversion: String To Number

```
var intString = "4";
var intNumber = parseInt(intString, 10);
var floatString = "3.14159";
var floatNumber = parseFloat(floatString);
```

Note:
Why would you need to convert datatypes?

---

##Conversion: Number To String

```
var number = 4;
number.toString(); => "4"
```

__OR__
```
number + ""; => "4"
```

Note:
Why would you need to convert datatypes?

---

##Numbers

Represent numerical data

int:         42

float:      3.14159265

---

##Numbers

Signed

int:         +6

float:      -8.2

Can perform arithmetic on number data types

---


##Arithmetic In JavaScript

![](../img/unit_1/arithmetic.jpg)

---

##Conditionals

![](../img/unit_1/cfDiagram.png)

---

##Making Decisions

It's either TRUE or FALSE (like booleans)

If you are greater than 18
you are an adult

	if (age > 18){
		document.write("You are an adult");
	}

---


![GeneralAssemb.ly](../../img/icons/code_along.png)
##Compare That

---


##Comparisons - Equality

Are two things equal?

```
10 === 10 //true
10 === 5 //false
"hi" === "hi" //true
```
---


##Logical Operators

![](../img/unit_1/logical_operators.png)

---

##Conditional Syntax

```
if(condition is true) {  
	//Do cool stuff
}
```

---

##Conditional Syntax

```
	if(condition is true) {
		//Do cool stuff
	}else{
		//Do other cool stuff
	}
```

---

##Conditional Syntax

```
	var topic = "JS";
	if (topic == "JS") {
		console.log("You're learning JavaScript");
	} else if(topic == "JavaScript") {
		console.log("You're still learning JavaScript");
	} else {
	console.log("You're learning something else");
}
```

---

##Multiple Conditions

```
if (name == "GA"  && password == "YellowPencil"){
	//Allow access to internet
}
```

---


##The Truth Table

```
if (name == "GA"  && password == "YellowPencil"){
	//Allow access to internet
}
```

---

##The Truth Table

![](../../img/unit_1/and_table.png)

---

##The Truth Table

```
if (day == "Tuesday"  || day == "Thursday"){
	//We have class today
}
```

---

##The Truth Table


![](../../img/unit_1/or_table.png)

---

##The Console


---

![GeneralAssemb.ly](../../img/icons/code_along.png)
##Blackout



![GeneralAssemb.ly](../../img/icons/exercise_icon_md.png)
##Temp Converter

---
