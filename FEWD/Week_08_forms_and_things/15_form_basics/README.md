![GeneralAssemb.ly](../../img/icons/instr_agenda.png)


##Lesson 15 - Basic Forms


###LEARNING OBJECTIVES

*	Differentiate the different types of inputs and why/where we would use each.

*	Explain how to group elements by name.

*	Perform pseudo-styling of input elements that the browser won't let us directly style.

*	Optional - Apply the method, action, and enctype attributes.


###SCHEDULE


| Time        | Topic| GA ICLs| Comments |
| ------------- |:-------------|:-------------------|:----------------|
| 30 min | Review | Application_Form| We've covered a lot of ground. Spend time reviewing all topics. |
| 120 min | [Forms and Inputs](https://github.com/generalassembly-studio/FEWD_2.0.0/blob/FEWD_2.0.1/Week_08_forms_and_things/15_form_basics/README.md#forms-and-inputs) | Registration_Form| A good place to take a break is right before radio buttons/checkboxes as the students. We need fresh brains so that grouping by name makes sense. |
| 30 min | [Optional Content](https://github.com/generalassembly-studio/FEWD_2.0.0/blob/FEWD_2.0.1/Week_08_forms_and_things/15_form_basics/README.md#optional-content) (get and validation) | Form_Validation Form_Search | This is __OPTIONAL__ depending on the pace of your course. |


---

###LESSON PLANNING NOTES

Below you will find notes on each section from the proposed schedule above. These notes are  meant to help you plan for a great class.  NOTE: Starter_code and solution_code is in this week's [assignment file](../AssignmentREVISED). 


####Forms and Inputs
_Time : 120min_


| Exercise | [Relaxr Registration Form](AssignmentREVISED/README.md)|
| ------------- |:-------------|
| __Time__ | 90 min | 
| __Topics__ |Forms, inputs, labels, (optional fieldset/legend),Layout | 
| __Description__|Students will build the Relaxr registration page from the [provided screenshot](../AssignmentREVISED/starter_code/images/relaxr-contact.png) and the [starter_code](../AssignmentREVISED/starter_code) |    
| __Notes__ | It is up to the instructor to determine whether to discuss fieldset and legends. You may either have students look these up using Google or discuss them in class. As a learning exercise, you may want to have them use divs and h2 tags and then discuss how there's special tags just for forms that do the same thing. You might want to have students look up the opt group tag, though the solution provided does not use that particular form element. Since they've seen forms they should have the knowledge to look this up.  Students don't need to do all of the styling for the form. Centering the form and getting the information on the right rows is considered sufficient. |

===


####Optional Content
_Time : 30min_


| Code along | [Form Search](solution/Form_Search) |
| ------------- |:-------------|
| __Time__ |15 min | 
| __Topics__ |Forms and simple search input, GET method and query string parameters | 
| __Description__|Exercise is designed to show students that data actually is sent somewhere when they click a submit button.|    
| __Notes__ | We suggest building the form from scratch (No starter code available). Make sure to point out the query string parameters. You can optionally show a POST request and use the console's network tab to show the post data. Build a simple form with a search input field and a submit button that says "Search!". The form should direct to search-page.html and use the GET method.|



| Code along | [Form Validation](solution/Form_Validation) |
| ------------- |:-------------|
| __Time__ |15 min | 
| __Topics__ |Validation of user forms using a library| 
| __Description__|Instructor will briefly demonstrate email validation using the parsley validation script or a validation script of there own choosing. Instructor can optionally cover browser based form validation. |    
| __Notes__ | The example is already completed but for an older version of the exercise, so if you want to briefly show validation you don't need to take time to write the code out in class if you want to demo using the older material.  If you want to demonstrate using the Relaxr form, be sure to write the code before class. Include parsley and jQuery. Add the following attributes to an email input field: ```data-trigger="change", data-required="true" , data-type="email"```
	
===

[![slides](../../img/icons/slides.png)](slides.md)

click icon for slides.
