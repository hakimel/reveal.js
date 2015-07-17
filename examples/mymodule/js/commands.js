(function($, Drupal) {
    /**
     * Add new command for reading a message.
     */
    Drupal.ajax.prototype.commands.readMessage = function(ajax, response, status){
        // Place content in current-msg div.
        $('#current-msg h2').html(response.subject);
        $('#current-msg p').html(response.content);
        // Remove from unread list.
        $('#msg-' + response.mid).remove();
        // Add message to read list.
        $('#read-msgs').append('<li>' + response.subject + '</li>');
    }
})(jQuery, Drupal);
