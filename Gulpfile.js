gulp = require('gulp');
let replace = require('gulp-replace-task');
let rename = require('gulp-rename');
let fs = require("fs");

let mainSlide = "index-modularized.html";
let buildPath = './build/';
let sourcePath = './src/';

function buildSlides(fileName, presenters, documentsToReadInOrder) {

	return gulp.src(mainSlide)
		.pipe(replace({
			patterns: [
				{
					match: 'presenters',
					replacement: createAnchors(presenters, "&nbsp;and&nbsp;")
				}
			]
		}))
		.pipe(replace({
			patterns: [
				{
					match: 'slideContents',
					replacement: loadContentInMemory(documentsToReadInOrder)
				}
			]
		}))
		.pipe(rename(fileName + ".html"))
		.pipe(gulp.dest(buildPath));
};

function loadContentInMemory(documentsToReadInOrder) {
	let memory = "";

	documentsToReadInOrder.forEach(function (document) {
		memory += fs.readFileSync(document, "utf8");
	});

	return memory;
};

function createAnchors(nameAndLinks, delimiter) {
	let result = '';

	nameAndLinks.forEach(function (nameAndLink) {
		var link = '<a href="' + nameAndLink[1] + '">' + nameAndLink[0] + '</\a>';

		if (result != '') {
			result += delimiter;
		}

		result += link;
	});

	return result;
}

gulp.task('slideDeck', function () {
	let env = require(sourcePath + 'slideDeck.js');

	let documentsToReadInOrder = env.documentsToReadInOrder;
	let fileName = env.slidesName;
	let presenters = env.presenters;

	return buildSlides(fileName, presenters, documentsToReadInOrder);
});
