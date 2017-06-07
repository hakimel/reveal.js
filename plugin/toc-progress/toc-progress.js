/********************************************************
*                                                       *
* Javascript for the TOC-Progress plugin for Reveal.js  *
*                                                       *
* Author: Igor Leturia                                  *
*                                                       *
* License: GPL v3                                       *
* http://www.gnu.org/copyleft/gpl.html                  *
*                                                       *
********************************************************/

/* TOC-Progress object and properties declaration with default values */

var toc_progress=
{
	toc_progress_on:false,
	reduceorscroll:'scroll',
	background:'rgba(0,0,127,0.1)',
};

/* Function to obtain all child elements with any of the indicated tags (from http://www.quirksmode.org/dom/getElementsByTagNames.html) */

toc_progress.getElementsByTagNames=function(list,obj)
{
	if (!obj)
	{
		var obj=document;
	};
	var tagNames=list.split(',');
	var resultArray=new Array();
	for (var i=0;i<tagNames.length;i++)
	{
		var tags=obj.getElementsByTagName(tagNames[i]);
		for (var j=0;j<tags.length;j++)
		{
			resultArray.push(tags[j]);
		};
	};
	var testNode=resultArray[0];
	if (!testNode)
	{
		return [];
	};
	if (testNode.sourceIndex)
	{
		resultArray.sort(
			function (a,b)
			{
				return a.sourceIndex-b.sourceIndex;
			}
		);
	}
	else if (testNode.compareDocumentPosition)
	{
		resultArray.sort(
			function (a,b)
			{
				return 3-(a.compareDocumentPosition(b)&6);
			}
		);
	};
	return resultArray;
};

/* Method to create the TOC-Progress footer */

toc_progress.create=function()
{

	// Create the skeleton

	var toc_progress_footer=document.createElement('footer');
	toc_progress_footer.setAttribute('id','toc-progress-footer');
	toc_progress_footer.setAttribute('style','background:'+this.background);
	var toc_progress_footer_main=document.createElement('div');
	toc_progress_footer_main.setAttribute('id','toc-progress-footer-main');
	toc_progress_footer.appendChild(toc_progress_footer_main);
	var toc_progress_footer_main_inside=document.createElement('div');
	toc_progress_footer_main_inside.setAttribute('id','toc-progress-footer-main-inside');
	toc_progress_footer_main.appendChild(toc_progress_footer_main_inside);
	var toc_progress_footer_main_inside_ul=document.createElement('ul');
	toc_progress_footer_main_inside.appendChild(toc_progress_footer_main_inside_ul);
	var toc_progress_footer_secondary=document.createElement('div');
	toc_progress_footer_secondary.setAttribute('id','toc-progress-footer-secondary');
	toc_progress_footer.appendChild(toc_progress_footer_secondary);
	var toc_progress_footer_secondary_inside=document.createElement('div');
	toc_progress_footer_secondary_inside.setAttribute('id','toc-progress-footer-secondary-inside');
	toc_progress_footer_secondary.appendChild(toc_progress_footer_secondary_inside);
	var toc_progress_footer_secondary_inside_ul=document.createElement('ul');
	toc_progress_footer_secondary_inside.appendChild(toc_progress_footer_secondary_inside_ul);
	var toc_progress_footer_secondary_inside_ul_ul=document.createElement('ul');
	toc_progress_footer_secondary_inside_ul.appendChild(toc_progress_footer_secondary_inside_ul_ul);
	var div_class_reveal=document.querySelectorAll('.reveal')[0];
	div_class_reveal.appendChild(toc_progress_footer);

	// Create the style element

	var style_node=document.createElement('style');
	style_node.setAttribute('id','toc-progress-style');
	style_node.appendChild(document.createTextNode('\n'));
	div_class_reveal.parentNode.insertBefore(style_node,div_class_reveal.nextSibling);

	// Detect main sections and subsections and create list elements in the TOC-Progress footer and styles for each

	var main_sections=document.querySelectorAll('.slides > section');	
	for (var main_sections_index=0;main_sections_index<main_sections.length;main_sections_index++)
	{
		var main_section=main_sections[main_sections_index];
		var secondary_sections=main_section.getElementsByTagName('section');
		if (secondary_sections.length>0)
		{
			for (var secondary_sections_index=0;secondary_sections_index<secondary_sections.length;secondary_sections_index++)
			{
				var secondary_section=secondary_sections[secondary_sections_index];
				var title_element=this.getElementsByTagNames('h1,h2,h3',secondary_section)[0];
				if (title_element!=null && (!title_element.hasAttribute('class') || title_element.getAttribute('class').indexOf('no-toc-progress')==-1))
				{
					if (secondary_sections_index==0)
					{
						if (secondary_section.hasAttribute('data-state'))
						{
							secondary_section.setAttribute('data-state',secondary_section.getAttribute('data-state')+' toc-progress-'+main_sections_index.toString());
						}
						else
						{
							secondary_section.setAttribute('data-state','toc-progress-'+main_sections_index.toString());
						};
						var li_element=document.createElement('li');
						li_element.setAttribute('id','toc-progress-'+main_sections_index.toString());
						toc_progress_footer_main_inside_ul.appendChild(li_element);
						var a_element=document.createElement('a');
						a_element.setAttribute('href','#/'+main_sections_index.toString());
						a_element.appendChild(document.createTextNode(title_element.textContent));
						li_element.appendChild(a_element);
						style_node.textContent=style_node.textContent+'.toc-progress-'+main_sections_index.toString()+' #toc-progress-'+main_sections_index.toString()+' {font-weight: bold;}\n';
						style_node.textContent=style_node.textContent+'html[class*="toc-progress-'+main_sections_index.toString()+'-"] #toc-progress-'+main_sections_index.toString()+' {font-weight: bold;}\n';
						style_node.textContent=style_node.textContent+'html:not([class*="toc-progress-'+main_sections_index.toString()+'-"]):not([class="toc-progress-'+main_sections_index.toString()+'"]) li[id^="toc-progress-'+main_sections_index.toString()+'-"] {display: none;}\n';
					}
					else
					{
						if (secondary_section.hasAttribute('data-state'))
						{
							secondary_section.setAttribute('data-state',secondary_section.getAttribute('data-state')+' toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString());
						}
						else
						{
							secondary_section.setAttribute('data-state','toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString());
						};
						var li_element=document.createElement('li');
						li_element.setAttribute('id','toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString());
						toc_progress_footer_secondary_inside_ul_ul.appendChild(li_element);
						var a_element=document.createElement('a');
						a_element.setAttribute('href','#/'+main_sections_index.toString()+'/'+secondary_sections_index.toString());
						a_element.appendChild(document.createTextNode(title_element.textContent));
						li_element.appendChild(a_element);
						style_node.textContent=style_node.textContent+'.toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString()+' #toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString()+' {font-weight: bold;}\n';
					};
				}
				else if (title_element==null)
				{
					var untitled_section_previous=secondary_section;
					do
					{
						if (untitled_section_previous.previousSibling==null)
						{
							untitled_section_previous=untitled_section_previous.parentNode;
						}
						else
						{
							untitled_section_previous=untitled_section_previous.previousSibling;
						};
					} while (untitled_section_previous!=null && (untitled_section_previous.nodeType!=Node.ELEMENT_NODE || !untitled_section_previous.hasAttribute('data-state')));
					if (untitled_section_previous!=null)
					{
						secondary_section.setAttribute('data-state',untitled_section_previous.getAttribute('data-state'));
					};
				};
			};
		}
		else
		{
			var title_element=this.getElementsByTagNames('h1,h2,h3',main_section)[0];
			if (title_element!=null && (!title_element.hasAttribute('class') || title_element.getAttribute('class').indexOf('no-toc-progress')==-1))
			{
				if (main_section.hasAttribute('data-state'))
				{
					main_section.setAttribute('data-state',main_section.getAttribute('data-state')+' toc-progress-'+main_sections_index.toString());
				}
				else
				{
					main_section.setAttribute('data-state','toc-progress-'+main_sections_index.toString());
				};
				var li_element=document.createElement('li');
				li_element.setAttribute('id','toc-progress-'+main_sections_index.toString());
				toc_progress_footer_main_inside_ul.appendChild(li_element);
				var a_element=document.createElement('a');
				a_element.setAttribute('href','#/'+main_sections_index.toString());
				a_element.appendChild(document.createTextNode(title_element.textContent));
				li_element.appendChild(a_element);
				style_node.textContent=style_node.textContent+'.toc-progress-'+main_sections_index.toString()+' #toc-progress-'+main_sections_index.toString()+' {font-weight: bold;}\n';
				style_node.textContent=style_node.textContent+'html[class*="toc-progress-'+main_sections_index.toString()+'-"] #toc-progress-'+main_sections_index.toString()+' {font-weight: bold;}\n';
				style_node.textContent=style_node.textContent+'html:not([class*="toc-progress-'+main_sections_index.toString()+'-"]):not([class="toc-progress-'+main_sections_index.toString()+'"]) li[id^="toc-progress-'+main_sections_index.toString()+'-"] {display: none;}\n';
			}
			else if (title_element==null)
			{
				var untitled_section_previous=main_section;
				do
				{
					if (untitled_section_previous.previousSibling==null)
					{
						untitled_section_previous=untitled_section_previous.parentNode;
					}
					else
					{
						untitled_section_previous=untitled_section_previous.previousSibling;
					};
				} while (untitled_section_previous!=null && (untitled_section_previous.nodeType!=Node.ELEMENT_NODE || !untitled_section_previous.hasAttribute('data-state')));
				if (untitled_section_previous!=null)
				{
					main_section.setAttribute('data-state',untitled_section_previous.getAttribute('data-state'));
				};
			};
		};
	};

	// Reduce or scroll the elements in the TOC-Progress footer if necessary

	this.reduceorscrollifnecessary(this.reduceorscroll);

	// Global variable to indicate that TOC-Progress footer is displayed

	this.toc_progress_on=true;
};

/* Method to destroy the TOC-Progress footer */

toc_progress.destroy=function()
{
	var toc_progress_footer=document.getElementById('toc-progress-footer');
	toc_progress_footer.parentNode.removeChild(toc_progress_footer);
	var toc_progress_style=document.getElementById('toc-progress-style');
	toc_progress_style.parentNode.removeChild(toc_progress_style);
	var title_element_sections=document.querySelectorAll('section[data-state*="toc-progress-"]');
	for (var title_element_sections_index=0;title_element_sections_index<title_element_sections.length;title_element_sections_index++)
	{
		var title_element_section=title_element_sections[title_element_sections_index];
		title_element_section.setAttribute('data-state',title_element_section.getAttribute('data-state').replace(/ toc-progress-\d+-\d+/g,''));
		title_element_section.setAttribute('data-state',title_element_section.getAttribute('data-state').replace(/toc-progress-\d+-\d+/g,''));
		title_element_section.setAttribute('data-state',title_element_section.getAttribute('data-state').replace(/ toc-progress-\d+/g,''));
		title_element_section.setAttribute('data-state',title_element_section.getAttribute('data-state').replace(/toc-progress-\d+/g,''));
		if (title_element_section.getAttribute('data-state')=='')
		{
			title_element_section.removeAttribute('data-state')
		};
	};

	// Global variable to indicate that TOC-Progress footer is not displayed

	this.toc_progress_on=false;
};

/* Method to toggle the TOC-Progress footer */

toc_progress.toggle=function()
{
	if (this.toc_progress_on==false)
	{
		this.create();
	}
	else
	{
		this.destroy();
	};
};

/* Reduce or scroll the elements in the TOC-Progress footer if necessary */

toc_progress.reduceorscrollifnecessary=function()
{
	this.reduceorscrollelementifnecessary(document.getElementById('toc-progress-footer-main'));
	this.reduceorscrollelementifnecessary(document.getElementById('toc-progress-footer-secondary'));
};

/* Reduce or scroll the elements in each section of the TOC-Progress footer if necessary */

toc_progress.reduceorscrollelementifnecessary=function(element)
{
	var visible_li_elements=0;
	var li_element_font_size=1000000;
	var li_elements=element.getElementsByTagName('li');
	for (var li_elements_index=0;li_elements_index<li_elements.length;li_elements_index++)
	{
		var li_element=li_elements[li_elements_index];
		li_element.removeAttribute('style');
		if (parseFloat(window.getComputedStyle(li_element).getPropertyValue('font-size').replace('px',''))<li_element_font_size)
		{
			li_element_font_size=parseFloat(window.getComputedStyle(li_element).getPropertyValue('font-size').replace('px',''));
		};
		if (window.getComputedStyle(li_element).getPropertyValue('display')!='none')
		{
			visible_li_elements=visible_li_elements+1;
		};
	};
	if (this.reduceorscroll=='reduce')
	{
		if (visible_li_elements*li_element_font_size>element.clientHeight)
		{
			var new_li_element_font_size=Math.floor(element.clientHeight/visible_li_elements);
			for (var li_elements_index=0;li_elements_index<li_elements.length;li_elements_index++)
			{
				var li_element=li_elements[li_elements_index];
				li_element.setAttribute('style','font-size:'+new_li_element_font_size.toString()+'px');
			};
		};
	}
	else if (this.reduceorscroll=='scroll')
	{
		var selected_element_index=-1;
		var visible_element_index=-1;
		for (var li_elements_index=0;li_elements_index<li_elements.length;li_elements_index++)
		{
			var li_element=li_elements[li_elements_index];
			if (window.getComputedStyle(li_element).getPropertyValue('display')!='none')
			{
				visible_element_index=visible_element_index+1;
			};
			if (window.getComputedStyle(li_element).getPropertyValue('font-weight')=='700')
			{
				selected_element_index=visible_element_index;
			};
		};
		if (selected_element_index!=-1)
		{
			if (selected_element_index*li_element_font_size>element.parentNode.clientHeight/2)
			{
				element.scrollTop=Math.floor((selected_element_index*li_element_font_size)-(element.parentNode.clientHeight/2)).toString();
			}
			else
			{
				element.scrollTop=0;
			};
		}
		else
		{
			element.scrollTop=0;
		};
	};
};

/* Method to initialize the TOC-Progress footer */

toc_progress.initialize=function(reducescroll,background)
{

	// Link to the TOC-Progress CSS

	var link=document.createElement("link");
	link.href="plugin/toc-progress/toc-progress.css";
	link.type="text/css";
	link.rel="stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);

	// Initialize properties according to parameters

	this.reduceorscroll=reducescroll || 'scroll';
	this.background=background || 'rgba(0,0,127,0.1)';

	// Capture 'q' key to toggle the display of the TOC-Progress footer

	if (Reveal.getConfig().keyboard!=false)
	{
		Reveal.configure({keyboard:{
			81:function(){toc_progress.toggle()}
		}});
	};

	// Capture 'slidechanged' event to reduce or scroll the elements in the TOC-Progress footer if necessary

	Reveal.addEventListener('slidechanged',function(event){toc_progress.reduceorscrollifnecessary(this.reduceorscroll)});
};

