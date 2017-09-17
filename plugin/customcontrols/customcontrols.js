/*****************************************************************
** Author: Asvin Goel, goel@telematique.eu
**
** A plugin replacing the default controls by custom controls.
**
** Version: 0.1
** 
** License: MIT license (see LICENSE.md)
**
******************************************************************/

var RevealCustomControls = window.RevealCustomControls || (function(){
	var config = Reveal.getConfig().customcontrols || 
		{ 
			slideNumberCSS : 'position: fixed; display: block; right: 90px; top: auto; left: auto; width: 50px; bottom: 30px; z-index: 31; font-family: Helvetica, sans-serif; font-size:  12px; line-height: 1; padding: 5px; text-align: center; border-radius: 10px; background-color: rgba(128,128,128,.5)',
			controls: [
				{
					icon: '<i class="fa fa-caret-left"></i>', 
	 				css: 'position: fixed; right: 60px; bottom: 30px; z-index: 30; font-size: 24px;', 
					action: 'Reveal.prev(); return false;' 
				}, 
				{
					icon: '<i class="fa fa-caret-right"></i>', 
					css: 'position: fixed; right: 30px; bottom: 30px; z-index: 30; font-size: 24px;', 
					action: 'Reveal.next(); return false;' 
                },
                {
					icon: '<i class="fa fa-caret-top"></i>', 
					css: 'position: fixed; top: 60px; bottom: 60px; z-index: 30; font-size: 24px;', 
					action: 'Reveal.next(); return false;' 
				} 
			] 
		};

	var reveal = document.querySelector(".reveal");

	for (var i = 0; i < config.controls.length; i++ ) {
		var control = document.createElement( 'div' );
		control.className = "customcontrols";
		control.style.cssText = config.controls[i].css;
		control.innerHTML = '<a href="#" onclick="' + config.controls[i].action + '">' + config.controls[i].icon + '</a>';
		document.querySelector(".reveal").appendChild( control );
	}

	Reveal.addEventListener( 'ready', function( event ) {
		if ( Reveal.getConfig().slideNumber && config.slideNumberCSS ) {
			var slideNumber = document.querySelector(".reveal .slide-number");
			slideNumber.style.cssText = config.slideNumberCSS;
		}
	} );

	return this;

})();
