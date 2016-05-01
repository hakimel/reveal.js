(function ($, window, Drupal, drupalSettings) {

  'use strict';

  /**
   * Command to Slide Down page elements before removing them.
   *
   * @param {Drupal.Ajax} [ajax]
   * @param {object} response
   * @param {string} response.selector
   * @param {string} response.duration
   * @param {object} [response.settings]
   * @param {number} [status]
   */
  Drupal.AjaxCommands.prototype.slideDown = function(ajax, response, status){
    // Get duration if sent, else use default of slow.
    var duration = response.duration ? response.duration : "slow";
    // Slide down the selected element(s).
    $(response.selector).slideDown(duration);
  }
})(jQuery, this, Drupal, drupalSettings);
