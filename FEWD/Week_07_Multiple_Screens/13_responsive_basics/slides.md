![GeneralAssemb.ly](https://github.com/generalassembly/ga-ruby-on-rails-for-devs/raw/master/images/ga.png "GeneralAssemb.ly")

#FEWD - Responsive Basics 

###Instructor Name

Instructors current role.

---


##Agenda

*	Review
*	Responsive Layouts
*	REM/EM
*	Media Queries

---


##Review

Let's bring HTML/CSS back into the equation.

---


![GeneralAssemb.ly](../../img/icons/Exercise_icon_md.png)
##Boxes

---


#Responsive Layout

---



![GeneralAssemb.ly](../../img/icons/code_along.png)
##Responsive Sites

---


![GeneralAssemb.ly](../../img/icons/exercise_icon_md.png)
##Mobile Boxes

---



##Fixed vs Responsive

Checkout these __Fixed__ sites

*	[UPS.com](http://www.ups.com)

*	[Boston.com](http://www.boston.com)

*	[Google.com](http://www.google.com)

*	[Getaround.com](http://www.getaround.com)


Checkout these __Responsive__ Sites

*	[Generalassemb.ly](http://www.generalassemb.ly)

*	[Dwolla.com](http://www.dwolla.com)

*	[Sweethatclub.com](http://www.sweethatclub.com)

*	[Relayrides.com](http://www.relayrides.com)

---

##Fixed Layout

*	Used up to this point

*	Relies on a container of fixed width

*	Usually 960px or 980px

---

##Responsive Layout

*	Different styles for different screen widths

*	Uses an elastic/fluid layout

*	Fluid

*	Sized in percentages

*	Elastic

*	Sized in ems

---


##EMS vs REMs - Needs more clarity

__EM__
Sized based on the width of the letter “m” 
Same as percentages*
1em=100% font-size
http://alistapart.com/articles/howtosizetextincss
Based on parent
Parent{ font-size:16px;}
Child{font-size:2em;}
Child’s font size is 32px

__REM__

“Root” em
Same as em
Caveat: Based on the font-size of html element


<aside class="notes">
Some browsers have issues with fonts sized in percents

</aside>

---


#Media Queries

---

##Media Queries - what should be in code?

@media only screen and
(max-width: xPx)
(min-width: xPx)
(max-device-width:xPx)
(min-device-width:xPx)

For iPad
(orientation: portrait)
(orientation: landscape)

Separate multiple clauses with “and”

---

##Mobile Display

<meta name="viewport" content="width=device-width, initial-scale=1">
Optional: user-scalable=none

<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=none">



Why necessary?
Mobile browser assumption of fixed layout of 980px
Standard media queries sizes
Small: up to 768px
Medium: 768-991px
Large: 992px+

<aside class="notes">

</aside>

---

##Usage

/*float boxes into columns*/
.box{
	float:left;
}
@media only screen and (max-width:768px){
	/*insert responsive css here
	ex: stack floated boxes
	*/
	.box{
		float:none;
	}
} 

If I put the media query before .box{float:left;} will this work as expected?

---

![GeneralAssemb.ly](../../img/icons/exercise_icon_md.png)
##Responsive Boxes

---


##Optional

Grid layouts
Transition (make media query changes smoother)

---