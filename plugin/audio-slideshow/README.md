Read me
===============

A plugin for easy audio playback and recording for reveal.js. Check out the live [demo](http://courses.telematique.eu/audio-slideshow/).


### Configuration

When initializing reveal you have to set the ```audioPrefix``` and ```audioSuffix``` value, include the plugins, and set keyboard shortcuts as specified below.

```javascript
Reveal.initialize({

	// ...
	
	audioPrefix: 'audio/',        // audio files are stored in the "audio" folder
	audioSuffix: '.ogg',	      // audio files have the ".ogg" ending
	audioDefaultDuration: 5, // default duration if no audio is available
	audioPlayerOpacity: 0.05,     // opacity value of audio player if unfocused

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
