var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/app',
    views: {},
    lists: {},
    shows: {}
};

couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));

module.exports = ddoc;