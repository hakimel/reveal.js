(function ($, window, Drupal, drupalSettings) {

  'use strict';

  /**
   * Drupal behavior to remove a log element when it is closed.
   *
   * @type {{attach: Function}}
   */
  Drupal.behaviors.ajaxDbLog = {
    attach: function(context, settings) {
      // Find all event close buttons and attach to click event.
      $(context).find('.dblog-event-close').on('click', function(event){
        // prevent the default action.
        event.preventDefault();
        // Get event-id (wid).
        var wid = $(this).data('event-id');
        // Hide details for the event.
        $('#dblog-event-details-' + wid).slideUp("slow", function() {
          // Remove the wid details (copied from the core remove command).
          $('#dblog-event-row-' + wid).remove();
        });
      });
    }
  }

})(jQuery, this, Drupal, drupalSettings);
