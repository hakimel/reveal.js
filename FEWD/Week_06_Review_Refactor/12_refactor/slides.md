![GeneralAssemb.ly](../../img/icons/FEWD_Logo.png)

#FEWD - Review and Refactor 

###Instructor Name

Instructors current role.

---


##Agenda

*	Refactor
*	This Keyword
*	Debugging Techniques

---

##Refactor

*	Making code more efficient without changing functionality.

---

##Refactor

The process of rewriting code without changing functionality
*	To reduce or eliminate redundancy
*	Make code easier to read
*	Make code more maintainable

---

##CSS Refactor

*	Remove inline styling
*	Replace repeated styles with classes
*	Rename classes/ids for readability
*	Organize CSS
*	Group by section
*	Order by precedence (tag selectors at top, id selectors at bottom)
*	Create classes for large CSS changes in JS
*	Remove unnecessary css

---

##JS Refactor

*	Use functions
*	Use variables
*	Use arrays
*	Combine jQuery selectors
*	Combine jQuery property changes into objects
	*	.css,.attr,etc
*	Chain jQuery function calls

---

![GeneralAssemb.ly](../../img/icons/code_along.png)
##Refactor 

---


##Keyword: "This"

jQuery: “this” refers to the selected object

---


##Topic

How about this code?

```
$(“p”).on(“click”,function(e){
    $(this).fadeOut(500);
});
```

Rule of thumb (ROT): If I don’t know what thing will be acted on, then I should consider using “this”


---

![GeneralAssemb.ly](../../img/icons/code_along.png)
##FAQ Refactor

---


##Debugging

Why isn't this working?

---


##Debugging

Always start be defining the problem. 

*	“The image is not moving”

*	“None of my code works”

---


##Debugging

This will tell you where to start your hunt

*	Image not moving
	*	find the code that makes the image move

*	None of my code works
	*	Syntax error, check console
---


##Debugging: Level __1__

Check for errors (red text, aligned right) in console
To access debugging console
	
	PC: CTRL+SHIFT+J
	Mac: COMMAND+OPTION+J

Click the error

The location may not be correct but is a good place to start
Ex: Unbalanced brackets or parentheses

---



##Debugging: Level __2__
	
So no red errors but not getting the right answer?
Try console.log

Ex: 

```
var stringOfNames=“”;
[“Bob”,”Joe”].forEach(function(element){
	stringOfNames-=element+”,”;
	console.log(stringOfNames);
});
```

---


##Debugging: Level __3__

*	Use the debugger in Chrome
*	Set a breakpoint
*	Run the code
*	Step through the code until you get to the error
*	Variable values display on the right
*	You can switch to the console to run code or check value of variable

---

##Debugging: Level __4__

Get help!

1.	Try “Your preferred search engine” search
2.	Be ready to clearly articulate the problem (Write out what your problem is)	
3.	If nothing, ask instructor



---

![GeneralAssemb.ly](../../img/icons/code_along.png)
##Debug

---


![GeneralAssemb.ly](../../img/icons/exercise_icon_md.png)
##Divided Times

Divided Times (alternative)

---
