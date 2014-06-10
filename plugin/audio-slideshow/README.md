Read me
===============

A plugin for easy audio playback and recording for reveal.js. Check out the live [demo](http://www.faculty.jacobs-university.de/agoel/audio-slideshow/).


### Configuration

When initializing reveal you have to set the ```autoSlide``` value, the ```audioPrefix``` and ```audioSuffix``` value, include the plugins, and set keyboard shortcuts as specified below.

```javascript
Reveal.initialize({

	// ...
	
	// Number of milliseconds between automatically proceeding to the
	// next slide, disabled when set to 0, this value is automatically 
	// increased for audio files with longer duration
	autoSlide: 5000,
	audioPrefix: 'audio/',
	audioSuffix: '.ogg',

	dependencies: [
	  
		// ... 
	  
		{ src: 'plugin/audio-slideshow/slideshow-recorder.js', condition: function( ) { return !!document.body.classList; } },				
		{ src: 'plugin/audio-slideshow/audio-slideshow.js', condition: function( ) { return !!document.body.classList; } }
	],					
	keyboard: { 
		82: function() { Recorder.toggleRecording(); },	// press 'r' to start/stop recording
		90: function() { Recorder.downloadZip(); } 	// press 'z' to download zip containing audio files
	}
});
```
