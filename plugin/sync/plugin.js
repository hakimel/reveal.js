/*!
 * reveal.js sync plugin
 */

const Plugin = () => {

  let isSpeakerView = false; //true: presenter/speaker view, false: main view
  let isSpeakerPreviewFrame = false; //we only want to zoom in the main presenter frame (not presenter preview frame)
  let broadcastChannel = new BroadcastChannel('sync_channel');

  /**
   * @typedef {Object} SyncMessage
   * @property {("play"|"pause"|"seeked"|"ratechange")} action
   * @property {string} xpathToVideo
   * @property {number} volume
   * @property {number} currentTime
   * @property {number} playbackRate
   */


  //from https://stackoverflow.com/questions/2661818/javascript-get-xpath-of-a-node
  /**
   * returns a dom node from a xpath expression
   * @param xpath the xpath
   * @returns {Node} the found node
   */
  function getElementByXpath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  //from https://stackoverflow.com/questions/2661818/javascript-get-xpath-of-a-node
  //modified to not use ids (because they might be not unique)
  /**
   * returns the xpath for a dom element
   * @param domElement the dom element
   * @returns {string} the xpath to the element
   */
  function getXPathForElement(domElement) {
    const idx = (sib, name) => sib
      ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName === name)
      : 1;
    const segs = elm => !elm || elm.nodeType !== 1
      ? ['']
      : [...segs(elm.parentNode), elm instanceof HTMLElement
        ? `${elm.localName}[${idx(elm)}]`
        : `*[local-name() = "${elm.localName}"][${idx(elm)}]`];
    return segs(domElement).join('/');
  }

  return {
    id: 'videoSync',

    init: function (reveal) {

      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());

      isSpeakerView = params.hasOwnProperty('receiver');

      //present html has a main view (iframe) and a preview next frame (iframe)
      //preview don't have controls (so they are explicitly hidden)
      isSpeakerPreviewFrame = isSpeakerView && params.hasOwnProperty('controls')

      if (isSpeakerView) {
        if (!isSpeakerPreviewFrame) {

          let sendMessage = (videoEl, action) => {

            if (!reveal.getConfig().syncVideoFromSpeakView) {
              return
            }

            let xpathToVideo = null;

            try {
              xpathToVideo = getXPathForElement(videoEl);
            } catch (err) {
              console.error(err);
              return
            }

            /** @type {SyncMessage} */
            const msg = {
              action: action,
              xpathToVideo: xpathToVideo,
              volume: videoEl.volume,
              currentTime: videoEl.currentTime,
              playbackRate: videoEl.playbackRate
            }
            broadcastChannel.postMessage(msg);
          }

          const allVideoEls = document.querySelectorAll(`video`)
          for (let i = 0; i < allVideoEls.length; i++) {
            /** @type {HTMLVideoElement} */
            const videoEl = allVideoEls[i]
            //speaker video should be muted
            videoEl.muted = true
            //ensure at least the speaker has controls
            videoEl.controls = true
            videoEl.addEventListener(`play`, (e) => {
              sendMessage(videoEl, `play`)
            })
            videoEl.addEventListener(`pause`, (e) => {
              sendMessage(videoEl, `pause`)
            })
            //actually speaker video should be muted...
            //does not handle mute/unmute
            // videoEl.addEventListener(`volumechange`, (e) => {
            // 	sendMessage(videoEl,`volumechange`)
            // })
            // videoEl.addEventListener(`seeking`, (e) => {
            // 	sendMessage(videoEl,`seeking`)
            // })
            videoEl.addEventListener(`seeked`, (e) => {
              sendMessage(videoEl, `seeked`)
            })
            videoEl.addEventListener(`ratechange`, (e) => {
              sendMessage(videoEl, `ratechange`)
            })
          }
        }
      } else {

        broadcastChannel.addEventListener('message', (event) => {

          if (!reveal.getConfig().syncVideoFromSpeakView) {
            return
          }

          /** @type {SyncMessage} */
          let message = event.data;

          let xpathToVideo = message.xpathToVideo;
          /** @type {HTMLVideoElement} */
          let video = null

          try {
            video = getElementByXpath(xpathToVideo);
          } catch (err) {
            console.error(err)
            return
          }
          if (!(video instanceof HTMLVideoElement)) {
            console.error(`videoSync: video not found for xpath ${xpathToVideo}`)
            return
          }

          switch (message.action) {
            case "play": {
              video.play()
              break;
            }
            case "pause": {
              video.pause()
              break;
            }
            case "seeked": {
              video.currentTime = message.currentTime
              break
            }
            case "ratechange": {
              video.playbackRate = message.playbackRate
              break
            }
            // case "volumechange": {
            // 	video.volume = message.volume
            // 		break;
            // }
          }

        })

      }

    },

    destroy: () => {

    }

  }
};

export default Plugin;
