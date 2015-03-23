/*****************************************************************
** Author: Asvin Goel, goel@telematique.eu
**
** Audio slideshow is a plugin for reveal.js allowing to
** automatically play audio files for a slide deck. After an audio 
** file has completed playing the next slide or fragment is  
** automatically shown and the respective audio file is played. 
** If no audio file is available, a blank audio file with default
** duration is played instead.
**
** Version: 0.4
** 
** License: MIT license (see LICENSE.md)
**
******************************************************************/

(function(){
	// default parameters
	var prefix = "audio/";
	var suffix = ".ogg";
	var textToSpeechURL = "http://tts-api.com/tts.mp3?q="; // the text to speech converter
	var defaultDuration = 5; // value in seconds
	var playerOpacity = .05; // opacity when the mouse is far from to the audioplayer
	var startAtFragment = false; // when moving to a slide start at the current fragment or at the start of the slide
	// ------------------

	var silence;
	var currentAudio = null;
	var previousAudio = null;

	Reveal.addEventListener( 'fragmentshown', function( event ) {
//console.debug( "fragmentshown ");
		selectAudio();
	} );

	Reveal.addEventListener( 'fragmenthidden', function( event ) {
//console.debug( "fragmenthidden ");
		selectAudio();
	} );

	Reveal.addEventListener( 'ready', function( event ) {
		setup();
//console.debug( "ready ");
		selectAudio();
	} );

	Reveal.addEventListener( 'slidechanged', function( event ) {
//console.debug( "slidechanged ");
		var indices = Reveal.getIndices();
		if ( !startAtFragment && typeof indices.f !== 'undefined' && indices.f > 0) {
			// hide fragments when slide is shown
			Reveal.slide(indices.h, indices.v, -1);		
		}
		
		selectAudio();
	} );

	Reveal.addEventListener( 'paused', function( event ) {
		currentAudio.pause();
	} );

	Reveal.addEventListener( 'resumed', function( event ) {
	} );

	Reveal.addEventListener( 'overviewshown', function( event ) {
		currentAudio.pause();
		document.querySelector(".audio-controls").style.visibility = "hidden";
	} );

	Reveal.addEventListener( 'overviewhidden', function( event ) {
		document.querySelector(".audio-controls").style.visibility = "visible";
	} );

	function selectAudio( previousAudio ) {
		if ( currentAudio ) {
			currentAudio.pause();
			currentAudio.style.display = "none";
		}
		var indices = Reveal.getIndices();
		var id = "audioplayer-" + indices.h + '.' + indices.v;
		if ( indices.f != undefined && indices.f >= 0 ) id = id + '.' + indices.f;
		currentAudio = document.getElementById( id );
		currentAudio.style.display = "block";
		if ( previousAudio && currentAudio.id != previousAudio.id ) {
			currentAudio.volume = previousAudio.volume;
			currentAudio.muted = previousAudio.muted;
//console.debug( "Play " + currentAudio.id);
			currentAudio.play();
		}
	}


	function setup() {
		if ( Reveal.getConfig().audioPrefix ) prefix = Reveal.getConfig().audioPrefix;
		if ( Reveal.getConfig().audioSuffix ) suffix = Reveal.getConfig().audioSuffix;
		if ( Reveal.getConfig().audioTextToSpeechURL ) textToSpeechURL = Reveal.getConfig().audioTextToSpeechURL;
		if ( Reveal.getConfig().audioDefaultDuration ) defaultDuration = Reveal.getConfig().audioDefaultDuration;
		if ( Reveal.getConfig().audioPlayerOpacity ) playerOpacity = Reveal.getConfig().audioPlayerOpacity;
		if ( 'ontouchstart' in window || navigator.msMaxTouchPoints ) {
			opacity = 1;		
		}
		if ( Reveal.getConfig().audioStartAtFragment ) startAtFragment = Reveal.getConfig().audioStartAtFragment;

		// set style so that audio controls are shown on hover 
		var css='.audio-controls>audio { opacity:' + playerOpacity + ';} .audio-controls:hover>audio { opacity:1;}';
		style=document.createElement( 'style' );
		if ( style.styleSheet ) {
		    style.styleSheet.cssText=css;
		}
		else { 
		    style.appendChild( document.createTextNode( css ) );
		}		
		document.getElementsByTagName( 'head' )[0].appendChild( style );

		silence = new SilentAudio( defaultDuration ); // create the wave file

		var divElement =  document.createElement( 'div' );
		divElement.className = "audio-controls";
		divElement.setAttribute( 'style', "width: 50%; height:75px; position: fixed; left: 25%; bottom: 4px;z-index: 10;" );
		document.querySelector( ".reveal" ).appendChild( divElement );

		// create audio players for all slides
		var horizontalSlides = document.querySelectorAll( '.reveal .slides>section' );
		for( var h = 0, len1 = horizontalSlides.length; h < len1; h++ ) {
			var verticalSlides = horizontalSlides[ h ].querySelectorAll( 'section' );
			if ( !verticalSlides.length ) {
				setupAllAudioElements( divElement, h, 0, horizontalSlides[ h ] );
			}
			else {
				for( var v = 0, len2 = verticalSlides.length; v < len2; v++ ) {
					setupAllAudioElements( divElement, h, v, verticalSlides[ v ] );
				}
			}
		}
	}
	function setupAllAudioElements( container, h, v, slide ) {
		setupAudioElement( container, h + '.' + v, slide.getAttribute( 'data-audio-src' ), slide.getAttribute( 'data-audio-text' ), slide.querySelector( ':not(.fragment) > video[data-audio-controls]' ) );
		var fragments = slide.querySelectorAll( '.fragment' ) ;
		for( var f = 0, len = fragments.length; f < len; f++ ) {
			setupAudioElement( container, h + '.' + v + '.' + fragments[ f ].getAttribute( 'data-fragment-index' ), fragments[ f ].getAttribute( 'data-audio-src' ), fragments[ f ].getAttribute( 'data-audio-text' ), fragments[ f ].querySelector( 'video[data-audio-controls]' ) );
		}

	}

	function linkVideoToAudioControls( audioElement, videoElement ) {
		audioElement.addEventListener( 'playing', function( event ) {
			videoElement.currentTime = audioElement.currentTime;
		} );			
		audioElement.addEventListener( 'play', function( event ) {
			videoElement.currentTime = audioElement.currentTime;
			if ( videoElement.paused ) videoElement.play();
		} );			
		audioElement.addEventListener( 'pause', function( event ) {
			videoElement.currentTime = audioElement.currentTime;
			if ( !videoElement.paused ) videoElement.pause();
		} );			
		audioElement.addEventListener( 'volumechange', function( event ) {
			videoElement.volume = audioElement.volume;
			videoElement.muted = audioElement.muted;
		} );		
		audioElement.addEventListener( 'seeked', function( event ) {
			videoElement.currentTime = audioElement.currentTime;
		} );	
		var sourceOfSilence= document.createElement( 'source' );
		if ( videoElement.duration > defaultDuration ) {
			// increase duration of silence	to duration of video
			var videoSilence = new SilentAudio( videoElement.duration ); // create the wave file
			sourceOfSilence.src= videoSilence.dataURI;
		}
		else {
			sourceOfSilence.src= silence.dataURI;
		}
		audioElement.appendChild( sourceOfSilence ); // use this if audio file does not exist
	}

	function setupAudioElement( container, indices, audioFile, text, videoElement ) {
		var audioElement = document.createElement( 'audio' );
		audioElement.setAttribute( 'style', "position: relative; top: 20px; left: 10%; width: 80%;" );
		audioElement.id = "audioplayer-" + indices;
		audioElement.style.display = "none";
		audioElement.setAttribute( 'controls', '' );
		audioElement.setAttribute( 'preload', 'none' );

		if ( videoElement ) {
			// connect play, pause, volumechange, mute, timeupdate events to video
			if ( videoElement.duration ) {
				linkVideoToAudioControls( audioElement, videoElement );
			}
			else {
				videoElement.onloadedmetadata = function() {
					linkVideoToAudioControls( audioElement, videoElement );	
				};
			}
		}
		audioElement.addEventListener( 'ended', function( event ) {
			if ( typeof Recorder == 'undefined' || !Recorder.isRecording ) {
				var previousAudio = currentAudio;
				Reveal.next();
				selectAudio( previousAudio );
			}
		} );
		audioElement.addEventListener( 'play', function( event ) {
			// preload next audio element so that it is available after slide change
			var indices = Reveal.getIndices();	
			var nextId = "audioplayer-" + indices.h + '.' + indices.v;		
			if ( indices.f != undefined && indices.f >= 0 ) {
				nextId = nextId + '.' + (indices.f + 1);
			}
			else {
				nextId = nextId + '.0';
			}
			var nextAudio = document.getElementById( nextId );
			if ( !nextAudio ) {
				nextId = "audioplayer-" + indices.h + '.' + (indices.v+1);
				nextAudio = document.getElementById( nextId );			
				if ( !nextAudio ) {
					nextId = "audioplayer-" + (indices.h+1) + '.0';
					nextAudio = document.getElementById( nextId );
				}			
			}
			if ( nextAudio ) {
//console.debug( "Preload: " + nextAudio.id );
				nextAudio.load();		
			}
		} );

		if ( textToSpeechURL != null && text != null ) {
			var audioSource = document.createElement( 'source' );
			audioSource.src = textToSpeechURL + encodeURIComponent(text);
			audioElement.insertBefore(audioSource, audioElement.firstChild);
		}

		if ( audioFile != null ) {
			// Support comma separated lists of audio sources
			audioFile.split( ',' ).forEach( function( source ) {						
				var audioSource = document.createElement( 'source' );
				audioSource.src = source;
				audioElement.insertBefore(audioSource, audioElement.firstChild);
			} );
		}
		else {
			var audioSource = document.createElement( 'source' );
			audioSource.src = prefix + indices + suffix;
			audioElement.insertBefore(audioSource, audioElement.firstChild);
		}	
		if ( !videoElement ) {
			// only add silence if no videoElement defines the minimum duration
			var sourceOfSilence= document.createElement( 'source' );
			sourceOfSilence.src= silence.dataURI;
			audioElement.appendChild( sourceOfSilence ); // use this if audio file does not exist
		}
		container.appendChild( audioElement );
	}

})();

/*****************************************************************
** Create SilentAudio 
** based on: RIFFWAVE.js v0.03
** http://www.codebase.es/riffwave/riffwave.js 
**
** Usage: 
** silence = new SilentAudio( 10 ); // create 10 seconds wave file
**
******************************************************************/

var FastBase64={chars:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encLookup:[],Init:function(){for(var e=0;4096>e;e++)this.encLookup[e]=this.chars[e>>6]+this.chars[63&e]},Encode:function(e){for(var h=e.length,a="",t=0;h>2;)n=e[t]<<16|e[t+1]<<8|e[t+2],a+=this.encLookup[n>>12]+this.encLookup[4095&n],h-=3,t+=3;if(h>0){var s=(252&e[t])>>2,i=(3&e[t])<<4;if(h>1&&(i|=(240&e[++t])>>4),a+=this.chars[s],a+=this.chars[i],2==h){var r=(15&e[t++])<<2;r|=(192&e[t])>>6,a+=this.chars[r]}1==h&&(a+="="),a+="="}return a}};FastBase64.Init();var SilentAudio=function(e){function h(e){return[255&e,e>>8&255,e>>16&255,e>>24&255]}function a(e){return[255&e,e>>8&255]}function t(e){for(var h=[],a=0,t=e.length,s=0;t>s;s++)h[a++]=255&e[s],h[a++]=e[s]>>8&255;return h}this.data=[],this.wav=[],this.dataURI="",this.header={chunkId:[82,73,70,70],chunkSize:0,format:[87,65,86,69],subChunk1Id:[102,109,116,32],subChunk1Size:16,audioFormat:1,numChannels:1,sampleRate:8e3,byteRate:0,blockAlign:0,bitsPerSample:8,subChunk2Id:[100,97,116,97],subChunk2Size:0},this.Make=function(e){for(var s=0;s<e*this.header.sampleRate;s++)this.data[s]=127;this.header.blockAlign=this.header.numChannels*this.header.bitsPerSample>>3,this.header.byteRate=this.header.blockAlign*this.sampleRate,this.header.subChunk2Size=this.data.length*(this.header.bitsPerSample>>3),this.header.chunkSize=36+this.header.subChunk2Size,this.wav=this.header.chunkId.concat(h(this.header.chunkSize),this.header.format,this.header.subChunk1Id,h(this.header.subChunk1Size),a(this.header.audioFormat),a(this.header.numChannels),h(this.header.sampleRate),h(this.header.byteRate),a(this.header.blockAlign),a(this.header.bitsPerSample),this.header.subChunk2Id,h(this.header.subChunk2Size),16==this.header.bitsPerSample?t(this.data):this.data),this.dataURI="data:audio/wav;base64,"+FastBase64.Encode(this.wav)},this.Make(e)};
