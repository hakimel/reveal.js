/*
 * A plugin for reveal.js that accepts a configuration xml and builds
 * a multiple-choice quiz.
 *
 */


var defaultOptions = {
    showScore : true,               // Show percentage correct, when quiz complete.
    showResponsesCorrect : false,   // After each response, show whether or not it was correct.
    generateNonce : false,           // Generate a code on quiz completion for use in class registration.
    callback : null,                // Function to call on completion of quiz generation.
    /* The following are planned features...
    saveProgress : false,           // Store responses in a cookie so user can come back later. Not yet implemented.
    takeOnlyOnce : false            // Set a cookie to try to prevent re-taking the quiz. Not yet implemented.
    */
};

var totalWeight = 0;
var totalCorrect = 0;

/*
 * xmlPath (string) - the path to the xml file to be used to generate the quiz.
 * target (string) - the selector of the html element to be populated with the quiz.
 * options (object) - described above.
 * revealConfig (object) - settings to be passed to standard reveal initialization.
 */
var quizInit = function(xmlPath, target, options, revealConfig) {
    // console.log('initializing quizBuilder');
    // Build options object from defaults & user-supplied.
    if (!options) {
        options = defaultOptions;
        // console.log('using default options');
    } else {
        for (var key in defaultOptions) {
            if (defaultOptions.hasOwnProperty(key) && (!options.hasOwnProperty(key))) {
                options[key] = defaultOptions[key];
            }
        }
    }

    // Get xml and call buildQuiz.
    $.ajax({
        type: "GET",
        url: xmlPath,
        dataType: "xml",
        success: function(xml){
                buildQuiz(xml, target, options, revealConfig);
            }
    });
};

var buildQuiz = function(xml, target, options, revealConfig) {
    // console.log('xml fetched');
    var targetEle = $(target)[0];
    // console.log('target:', targetEle);

    var scores = buildScoring(xml);

    var tHtml = buildTitleHtml(xml);
    $(targetEle).append(tHtml);

    var qHtml = buildQuestionsHtml(xml);
    $(targetEle).append(qHtml);

    var rHtml = buildResultsHtml(xml, options);
    $(targetEle).append(rHtml);

    bindSubmit(scores, options);


    // Initialize reveal.js
    // Full list of configuration options available here:
    // https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize(revealConfig);
    if (options.callback) {
        options.callback();
    }
};

var buildScoring = function(xml) {
    var scores = [];
    // Build and array of score objects with the data for each score bracket.
    $(xml).find('scoring score').each(function(s_index) {
        var scoreObj = {};
        scoreObj.class = $(this).attr('type');
        scoreObj.min = +$(this).find('min').text() || 0;
        scoreObj.max = +$(this).find('max').text() || 100;
        scoreObj.descrip = $(this).find('description').text();
        scores.push(scoreObj);
    });

    // Sort array by the low end of each bracket.
    scores.sort(function(a, b){
        return a.min - b.min;
    });

    // If needed, correct score ranges not to overlap or gap.
    for (var j = 0, l = scores.length; j < l - 1; j++) {
        var score = scores[j];
        var nextScore = scores[j + 1];
        if (score.max + 1 != +nextScore.min) {
            console.log('Correcting score gap or overlap.');
            score.max = nextScore.min - 1;
        }
    }

    return scores;
};

var buildTitleHtml = function(xml) {
    var name = $(xml).find('name').text();
    var titleHtml = '<section><h2>Quiz</h2><h3>' + name + '</h3>';
    titleHtml += '<input class="button" type="button" onclick="Reveal.navigateNext();" value="Begin" />';
    titleHtml += '</section>';
    return titleHtml;
};

var buildQuestionsHtml = function(xml) {
    var questions = $(xml).find('question');
    if (questions.length) {
        // console.log('questions found:', questions.length);
        var htmlString = '';
        $(questions).each(function(q_index) {
            // Basic xml chunks
            var qs = $(this).find('q');
            var notes = $(this).find('note');
            var as = $(this).find('answers a');
            var weight = '1';
            var correctInput;

            // Start building html for each question/slide.
            htmlString += '<section class="quizQuestion">';
            // Build the question and add its value to the total quiz weight.
            $(qs).each(function(){
                htmlString += '<p>' + $(this).text() + '</p>'
                weight = $(this).attr('weight') || weight;
                totalWeight += +weight;
            });
            // Add notes.
            $(notes).each(function(){
                htmlString += '<p class="note">' + $(this).text() + '</p>'
            });
            // Add answer options.
            htmlString += '<div class="answerWrap">';
            $(as).each(function(a_index){
                htmlString += 
                    '<span class="answer">' +
                        '<input type="radio" name="question_' + q_index + '" value="' + a_index + '" />' +
                        '<label>' + $(this).text() + '</label>' +
                    '</span>';
                // Build hidden input with obscured correct answer.
                if ($(this).attr('correct') === 'true') {
                    correctInput = '<input type="hidden" value="' + q_index + '_' + a_index + '_' + weight + '" />';
                }
            });
            htmlString += '<input type="button" class="submitAnswer" value="Submit"/>';
            htmlString += correctInput;
            htmlString += '</div>';
            htmlString += '</section>';
        });
        return htmlString;
    } else {
        console.log('No questions found.');
        return null;
    }
};

// Build the results slide, based on options.
var buildResultsHtml = function(xml, options) {
    var resultsHtml = '<section class="quizResults"><h2>Quiz complete</h2>';
    resultsHtml += '<p id="results">';
    if (options.showScore) {
        resultsHtml += '<span id="score"></span><span id="descrip" sytle="width: 80%;">'
    } else {
        resultsHtml += '<span id="descrip">';
    }
    resultsHtml += '</span></p>';
    if (options.generateNonce) {
        resultsHtml += '<p class="nonce">Confirmation code:</p><h4 id="nonce"></h4>';
    }
    resultsHtml += '</section>';
    return resultsHtml;
};

var confirmSubmit = true;
var bindSubmit = function(scores, options) {
    var buttons = $('input.submitAnswer');
    $(buttons).click(function() {
        // Get the correct and selected values from the dom.
        var currentQ = $(this).parents('.answerWrap');
        var submittedRadio = $(currentQ).find('input:radio:checked');
        if (!submittedRadio.length && confirmSubmit) {
            $(currentQ).parent().append('<p class="warning">Are you sure you want to continue without a response?</p>');
            confirmSubmit = false;
            return false;
        }
        var submittedLabel = $(submittedRadio).next('label');
        var hiddenValsArr = $(currentQ).find('input[type=hidden]').val().split('_');
        var rightAns = hiddenValsArr[1];

        // Add correct answers to the running total.
        var isRight = (submittedRadio.val() === rightAns);
        if (isRight) {
            totalCorrect += +hiddenValsArr[2];
        }

        // If this is the last slide, calculate totals and update the results.
        if (this === $(buttons).last()[0]) {
            // console.log('Last button. Calculating...');
            handleScoreTotal(scores, options);
        }

        // Handle yes/no styling for submitted responses, or just proceed.
        if (options.showResponsesCorrect) {
            if (isRight) {
                $(submittedLabel).css('color', 'green');
            } else {
                $(submittedLabel).css('color', 'red');
            }
            $(submittedLabel).parent().siblings('span').find('label').css('color', 'gray');
            $(currentQ).find('input:radio:not(:checked)').each(function() {
                this.disabled = true;
            })
            setTimeout(nextSlide, 2000);
        } else {
            nextSlide();
        }
        
    });
    var nextSlide = function() {
        confirmSubmit = true;
        Reveal.navigateNext();
    };
};

var handleScoreTotal = function(scores, options) {
    // Pretty straightforward.
    var finalScore = Math.floor(totalCorrect / totalWeight * 100);
    var scoreInfo;
    // console.log('score:', finalScore);

    // Select which score bracket the user qualifies into.
    for (var k = 0, l = scores.length; k < l; k++) {
        if (finalScore <= scores[k].max) {
            scoreInfo = scores[k];
            break;
        }
    }

    if (scoreInfo) {
        // Update results slide with colors, values, messaging, and encrypted score.
        var resultsSlide = $('.quizResults');
        $(resultsSlide).find('#results').addClass(scoreInfo.class).append(scoreInfo.descrip);
        if (options.showScore) {
            $(resultsSlide).find('#score').html(finalScore);
        }
        // If generating a confirmation code we'll use a timestamp to lightly
        // encrypt the user's score and include the key in the result.
        if (options.generateNonce) {
            var now = new Date();
            now = now.getTime();
            now = now.toString();
            var timeNonce = now.substr(now.length - 3);
            var scoreNonce = Math.floor((finalScore + 5) * .65 * timeNonce);
            $(resultsSlide).find('#nonce').html(scoreNonce + 'Q' + timeNonce);
            // switch(scoreInfo.class) {
            //     case 'yes':
            //         $(resultsSlide).find('.nonce').prepend('You ');
            //         break;
            //     case 'easy':
            //     case 'maybe':
            //         $(resultsSlide).find('.nonce').prepend('If you choose to register, you ');
            //         break;
            //     case 'fail':
            //         $(resultsSlide).find('.nonce').prepend('If you choose to register anyway, you ');
            //         break;
            // }
        }
    } else {
        console.log('No score info for that value.')
    }
};

/*
 * Hidden function for decrypting a lightly encrypted score.
 * nonce (string) - the confirmation code.
 */
var decryptNonce = function(nonce) {
    var nonceParts = nonce.split('Q');
    var decryptedScore = Math.ceil(nonceParts[0] / .65 / nonceParts[1]) - 5;
    console.log('Score:', decryptedScore);
};
