(function(window) {
  
  // Load paper.js
  head.js('https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.24/paper-full.min.js', function() {
		if(typeof paper === 'undefined') {
			head.js('plugin/paper-js/aper-full.min.js');
		};
	});
  
})(window);
