/*

    Aidan Casey Feb 2014 - https://github.com/aidancasey

    Text to speech plugin

    Adds automated speech to your presentation. 
    
    If you want to incude speech when a new section of your presentation is loaded simply add the attribute 'text-to-speech' to the section .

    ***Note you must have internet connection as the text to speech trsanslation is powered by googles text to speeech API's ***

    all the heavy lifting courtesy of the following open source projects:
        
        Ramesh Nair    : https://github.com/hiddentao/google-tts 
        Scott Schiller:  http://schillmania.com/projects/soundmanager2/

    
    Example:
                <section text-to-speech='Welcome to my presentation'>
                    <h1>Your title</h1>
                    
                    <p>
                        <small>Welcome to my presentation!</small>
                    </p>
                </section>

    Include the dependency in your slideshow as follows:

        dependencies: [
            ...
            { src: 'plugin/text-to-speech/tts.js', async: true, condition: function() { return !!document.querySelector( '[text-to-speech]' ); } }
        ]
*/
function loadScript(url, callback) {

    var script = document.createElement('script')
    script.type = 'text/javascript';

    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == 'loaded' ||
                script.readyState == 'complete') {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

//sound manager used for any browser that doesn't support HTML 5 audio tag
loadScript('plugin/text-to-speech/soundmanager2-jsmin.js', function () {
    //initialise soundManager
    soundManager.setup({
        url: '/',
        preferFlash: false,
        onready: function () {
            console.log('ready SM');
        }
    });
});

loadScript('plugin/text-to-speech/google-tts.js', function () {
    Reveal.addEventListener('slidechanged', function (event) {
        nextindexh = event.indexh;
        var sentence = document.getElementsByTagName('section')[nextindexh].getAttribute('text-to-speech');
        if (sentence != null) {
            var googleTTS = new window.GoogleTTS();
            googleTTS.play(sentence, 'en', function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('Finished playing');
            });
        }
    });

});