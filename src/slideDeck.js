let presenters = require('./presenters');

let slideDeck = {};

// name multiple pre defined presenters here to be included in the slide
slideDeck.presenters = [presenters.a]

//name of the main slide
slideDeck.slidesName = "slide-deck-modularized";

// content to be included from set of topics
slideDeck.documentsToReadInOrder = [
    "content/firstTopic.html",
    "content/secondTopic.html"
];

module.exports = slideDeck;