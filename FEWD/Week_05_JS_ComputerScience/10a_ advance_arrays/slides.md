![GeneralAssemb.ly](../../img/icons/FEWD_Logo.png)

#FEWD - Arrays

###Instructor Name

Instructors current role.

---


##Agenda

*	Collection Of Data
*	Manipulating Collections

---


##Arrays Collections


![accordion folder](../../img/unit_1/accordian.jpg)

---


##Arrays

What if we had a collection of images that we wanted to display to the screen one at a time? 

How could we store all the images? 

---


##Arrays

What is an array?

---



##Declaring Arrays

var myArr = new Array();

*	declaring an empty array using the Array constructor.

---


##Declaring Arrays

var myArr = [ ];

*	declaring an empty array using literal notation.
	
---

##Declaring Arrays

myArr = ['Hello', 54.3, true];

*	Arrays are filled with elements: i.e. myArr3 = [element, anotherElement];
*	Elements can contain strings, numbers, booleans, and more.
	

---

##Declaring Arrays
	
	
If you leave a blank spot in an array it creates a blank shelf space (undefined) placeholder.

---


##Arrays Indexing

![Array Indexing](../../img/unit_1/array_index_diagram.png)


---


##Arrays Indexing

Array elements can be fetched by their index number (starts from 0).

	myArr = ['Hello', , 54.3, true];

	console.log(myArr[0]); //prints Hello
	console.log(myArr[1]); //prints undefined
	console.log(myArr[2]); //prints 54.3
	console.log(myArr[3]); //prints true
	
---


##Arrays Indexing

We can insert new values into any space in the array using the positions index.

	myArr[1] = 'Stuff';


---


##Arrays Indexing

We can overwrite all the elements of an array simply by giving the array new values or by setting an array equal to a different array.
	
	var fruits = ['Apples', 'Oranges', 'Pears', 'Bananas'];
	var myArr=[1,2,3];
	myArr = fruits;
	
	console.log(myArr); //prints Apples, Oranges, Pears, Bananas

---

##Array Length

What if I would like to know how long my array is (how many elements)?
	
	console.log(myArr.length); //prints 4

---

![GeneralAssemb.ly](../../img/icons/code_along.png)
##Arrays

---


##Iterate Over Array

Allows you to run code using each element from the array as a value
Syntax:

	Array.forEach



---


##Array Length

	var fruits=[“Banana”,”Apple”,”Pear”]
		fruits.forEach(function(element,index){
		console.log(element,index);
	});

Note:
Element is the item from the array
Index is the item’s position in the array
As always, code we want to execute goes between curly braces

---


##More on Arrays

For many more Array methods see:https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array


---



![GeneralAssemb.ly](../../img/icons/exercise_icon_md.png)
##Carousel

---
