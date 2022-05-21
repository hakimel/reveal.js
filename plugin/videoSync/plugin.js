/*!
 * reveal.js Zoom plugin
 */
const Plugin = () => {

	let isSpeakerView = false; //true: presenter/speaker view, false: main view
	let isSpeakerPreviewFrame = false; //we only want to zoom in the main presenter frame (not presenter preview frame)
	let broadcastChannel = new BroadcastChannel('zoom_channel');

	return {
		id: 'videoSync',

		init: function( reveal ) {

			const urlSearchParams = new URLSearchParams(window.location.search);
			const params = Object.fromEntries(urlSearchParams.entries());

			isSpeakerView = params.hasOwnProperty('receiver')

			//present html has a main view (iframe) and a preview next frame (iframe)
			//preview don't have controls (so they are explicitly hidden)
			isSpeakerPreviewFrame = isSpeakerView && params.hasOwnProperty('controls')

			if (isSpeakerView) {
			    if (isSpeakerPreviewFrame) {
						console.log(`preview`)
						console.log(document)
						console.log(document.querySelectorAll(`video`))
			    } else {
						console.log(`speaker`)
						console.log(document)
						console.log(document.querySelectorAll(`video`))
					}
			}

		},

		destroy: () => {

		}

	}
};

export default Plugin;
