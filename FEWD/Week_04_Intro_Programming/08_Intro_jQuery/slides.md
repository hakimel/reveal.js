![GeneralAssemb.ly](../../img/icons/FEWD_Logo.png)

#FEWD - jQuery Intro

###Instructor Name

Instructors current role.

---


##Agenda

*	Intro To Programming Review
*	Intro To jQuery
*	jQuery Basics
	*	File Structure
	*	Syntax
*	Adding Interactivity

---

##Intro To Programming Review

What are your questions?

---


##Intro To jQuery

---

##What Is jQuery



---


##jQuery

jQuery __is__ JavaScript

---


##jQuery

jQuery is a cross-browser JavaScript library designed to simplify the client-side scripting of HTML.

---

##jQuery

*	jquery.com - A JavaScript library that makes DOM manipulation simple.*	“Cross browser” - works the same in all* browsers.*	Allows:
	*	Document traversal	*	CSS Manipulation	*	Event Handling	*	Animation	*	and more!

---

##JS/jQuery Basics

---


##Script Tags

---

##jQuery

Adding jQuery to your website

```<script src="js/jquery-1.8.3.min.js"></script>``` - Adding the file.

```<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>``` - CDN

---


##Syntax

__Syntax:__ Spelling and grammar rules of a programming language.


Note:
Like with any language, there are formal rules around how to write it. This is the syntax.


---

##JavaScript Syntax - Punctuation

*	Semicolon
*	Brackets
*	Parentheses
*	Quotation Marks

---

##JavaScript Syntax - Comments

	//Single Line Comments

	/* Multi line comments */

---


##jQuery Syntax

###$

The Dollar Sign

---

##jQuery Syntax - Selectors


Selectors are just like CSS

	$(".class").click();

Note: document.getElementById('thingy').onclick = doSomething;

	function doSomething() {
    	// make something happen here
	}

In jQuery, this might look more like:

	$('selector').click(doSomething);

	function doSomething() {
		// make something happen here
   	}


Note: We will certainly be discussing this in more detail, but in general jQuery let’s us grab some element from the page ($('slector')), and do something with it ($('selector').click(doSomething);). In this case, we grabbed an element with the id thingy and used .click() to make a function run when the user clicks on #thingy.

---


##jQuery Click Event

###.click()

---



![GeneralAssemb.ly](../../img/icons/code_along.png)
##jQuery Traffic Light

---

![GeneralAssemb.ly](../../img/icons/exercise_icon_md.png)
##Syntax Drill  

---



##Adding Interactivity

---
