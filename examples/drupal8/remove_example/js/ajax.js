(function ($, window, Drupal, drupalSettings) {

  'use strict';

  /**
   * Command to slide up content before removing it from the page.
   *
   * @param {Drupal.Ajax} [ajax]
   * @param {object} response
   * @param {string} response.selector
   * @param {string} response.duration
   * @param {object} [response.settings]
   * @param {number} [status]
   */
  Drupal.AjaxCommands.prototype.slideRemove = function(ajax, response, status){
    // Get duration if sent, else use default of slow.
    var duration = response.duration ? response.duration : "slow";
    // Retrieve settings (copying what core remove command does).
    var settings = response.settings || ajax.settings || drupalSettings;
    // Targetd all elements that match returned selector.
    $(response.selector).each(function() {
      // Slide up content, using response duration.
      $(this).slideUp(duration, function() {
        // Copy core 'remove' command and detach all Drupal Behaviors from element.
        Drupal.detachBehaviors(this, settings);
        // Call jQuery remove() function and remove element from DOM.
        $(this).remove();
      });
    });
  }

})(jQuery, this, Drupal, drupalSettings);