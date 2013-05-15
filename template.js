exports.description = "Create beautiful presentations using HTML with reveal.js.";

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
  'install_. After that, you may execute project tasks with _grunt_. For ' +
  'more information about installing and configuring Grunt, please see ' +
  'the Getting Started guide:' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// Ensure use needs --force option for any warning
exports.warnOn = '*';

// The real meat
exports.template = function(grunt, init, done) {
  "use strict";

  // Start prompting..
  init.process({
    "scripts": {
      "test": "grunt jshint",
      "start": ""
    },
    "engines": {
      "node": "~0.8.0"
    },
    "dependencies": {
      "underscore": "~1.3.3",
      "express": "~2.5.9",
      "mustache": "~0.4.0",
      "socket.io": "~0.9.13"
    },
    "devDependencies": {
      "grunt-contrib-jshint": "~0.2.0",
      "grunt-contrib-cssmin": "~0.4.1",
      "grunt-contrib-uglify": "~0.1.1",
      "grunt-contrib-watch": "~0.2.0",
      "grunt-contrib-sass": "~0.2.2",
      "grunt-contrib-connect": "~0.2.0",
      "grunt-zip": "~0.7.0",
      "grunt": "~0.4.0"
    }
  }, [
    init.prompt('name'),
    init.prompt('version'),
    init.prompt('title'),
    init.prompt('description', 'The best presentation ever.'),
    init.prompt('author_name'),
    init.prompt('author_url'),
    {
      name: 'author_twitter_handle',
      message: 'Author twitter user name.',
      default: function(value, data, done) {
        var handle = "twitter_handle"
        if (data.author_name) {
          handle = data.author_name;
          handle = handle.toLowerCase()
                         .replace(/ /g, '_');
          done(null, handle);
        } else {
          done(null, handle);
        }
      },
      warning: 'Don\'t prefix with "@".'
    },
    {
      name: 'langcode',
      message: 'The language of the default index.html',
      default: 'en',
      warning: 'It must be an 2 character language code.'
    }
  ], function(err, props) {

    // Grab the files...
    var files = init.filesToCopy(props);

    // Actually copy (and process) files...
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    done();
  });

};