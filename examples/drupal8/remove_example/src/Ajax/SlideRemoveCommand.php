<?php
/**
 * @file
 * Contains \Drupal\ajax_dblog\Ajax\SlideUpCommand.php
 */

namespace Drupal\remove_example\Ajax;
// Need to include CommandInterface class when creating a callback command.
use Drupal\Core\Ajax\CommandInterface;

/**
 * An AJAX command for calling the jQuery slideUp() and remove() methods.
 *
 * This command is implemented by Drupal.AjaxCommands.prototype.slideRemove()
 * defined in remove_example/js/ajax.js.
 *
 * @see http://learn.jquery.com/effects/intro-to-effects/#changing-display-based-on-current-visibility-state
 *
 * @ingroup ajax
 */
class SlideRemoveCommand implements CommandInterface {

  /**
   * A CSS selector string.
   *
   * If the command is a response to a request from an #ajax form element then
   * this value can be NULL.
   *
   * @var string
   */
  protected $selector;

  /**
   * The duration of the slide.
   *
   * A string or number determining how long the animation will run.
   *
   * @var string|integer
   */
  protected $duration;

  /**
   * Constructs an SlideToggleCommand object.
   *
   * @param string $selector
   *   A CSS selector.
   * @param string|integer $duration
   *   A string or number determining how long the animation will run.
   */
  public function __construct($selector, $duration = NULL) {
    $this->selector = $selector;
    $this->duration = $duration;
  }

  /**
   * Implements Drupal\Core\Ajax\CommandInterface:render().
   */
  public function render() {
    // Render method must return an associative array.
    return array(
      // Must return element with key 'command'. Value is name of JavaScript
      // method to run.
      'command' => 'slideRemove',
      // All other elements will be returned as part of the response argument.
      'selector' => $this->selector,
      'duration' => $this->duration,
    );
  }
}