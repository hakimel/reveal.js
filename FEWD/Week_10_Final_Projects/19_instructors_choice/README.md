![GeneralAssemb.ly](https://github.com/generalassembly/ga-ruby-on-rails-for-devs/raw/master/images/ga.png "GeneralAssemb.ly")


##CSS Animation [Sample Lesson -- Please Feel Free to Either Use This Lesson or Develop a Lesson on Any Topic You Wish to Teach!]


###LEARNING OBJECTIVES

*	Be able to explain why CSS animations are preferred over jQuery animate.

*	Familiarity with how animations and transitions can be used in CSS

*	Understand how animation can still be controlled using JS


###SCHEDULE


| Time        | Topic| GA ICLs| Comments |
| ------------- |:-------------|:-------------------|:----------------|
| 20 min | Transitions |transitions  |  |
| 20 min | Animations | animations  |  | 
| 120 min | Lab: Egg drop game | | Not a ground up project. Students only need to fill in missing code. All missing code has instructions. |


###LESSON PLANNING NOTES

Below you will find notes on each section from the proposed schedule above. These notes are  meant to help you plan for a great class.


##[Transitions]((solution/transition)

###Time: 5-10 min

| | |
| ------------- |:-------------|
| __Topics__ | CSS Transitions | 
| __Description__| This COA is a simple example of how you can use transitions to create an image carousel.|    
| __Activity_Type__| Code Along|
 


####Instructional Design Notes

*	Instructor should open the index.html in the Chrome browser. 
*	They should then use jQuery's add class to add the img-moved-left class to the first image. 
*	This will cause the image to slide to the left (-500px margin).
*	If additional examples are needed, instructors can use jQuery's .css to show other transitions. 
*	Note: In this case, the CSS for margin-left transitions should be changed to "all" or the new style.



##[Animations](solution/animation)

###Time: 5-10 min

| | |
| ------------- |:-------------|
| __Topics__ | CSS Animations | 
| __Description__| This COA is a simple example of how you can use animations to make an image spin at varying speeds. |  
| __Activity_Type__| Code Along|  
 


####Instructional Design Notes

*	Instructor should open the index.html in the Chrome browser and show the students what's happening with the wheel. 
*	They should then open the CSS file in Sublime and walk through the animation code. 
*	They should then go back to the browser and remove the spin-me class to show that the animation does indeed stop (and now that the image is a GIF or something like that).



##Animation/Transition Event endings

###Time: 5-10 min

| | |
| ------------- |:-------------|
| __Topics__ | Animations/Transition event endings | 
| __Description__| This COA is a simple example of why students should care about animation/transition end events|    
 


####Instructional Design Notes

1.	Open the transitions index.html in the Chrome browser.
2.	Run the addClass code from Ex 1 a couple of times to show what happens.
3.	Refresh the page. Then copy and paste the following code into the browser's console and explain what each line does:

		```JavaScript
		$("#image-container").on("transitionEnd webkitTransitionEnd", ".img-moved-left",function(){
			$("#image-container").append(this);
			$(this).removeClass("img-moved-left");
		});
		```

4.	Run the addClass code multiple times again and show how we now get an image carousel


![Exercise - Instructor](../../img/icons/instr_lab.png)

Remember to share the [starter_code](starter_code/) at the beginning of class. Share code_along solutions before lab time so students have an example to reference. 


###[Egg drop](starter_code)

####Time: 120 min

| | |
| ------------- |:-------------|
| __Topics__ | CSS animation, transitions, jQuery, events, variables, ifs, pseudocode, reading code| 
| __Description__| The exercise is a classic egg drop game. Students will repair the code and fill in missing information in order to be able to play the game.|    
 

####Instructional Design Notes 

*	See .js file in starter_code.
