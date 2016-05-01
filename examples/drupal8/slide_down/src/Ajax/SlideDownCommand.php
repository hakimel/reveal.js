<?php
/**
 * @file
 * Contains \Drupal\slide_down\Ajax\SlideDownCommand.php
 */

  namespace Drupal\slide_down\Ajax;

  use Drupal\Core\Ajax\CommandInterface;

  /**
   * An AJAX command for calling the jQuery slideDown() method.
   *
   * The 'insert/after' command instructs the client to use jQuery's after()
   * method to insert the given HTML content after each element matched by the
   * given selector.
   *
   * This command is implemented by Drupal.AjaxCommands.prototype.slideDown()
   * defined in slide_down/js/slidedown-command.js.
   *
   * @see http://learn.jquery.com/effects/intro-to-effects/#changing-display-based-on-current-visibility-state
   *
   * @ingroup ajax
   */
  class SlideDownCommand implements CommandInterface {

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
     * Constructs an SlideDownCommand object.
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
      return array(
        // 'command' element passes name of JavaScript function to execute.
        'command' => 'slideDown',
        'method' => NULL,
        'selector' => $this->selector,
        'duration' => $this->duration,
      );
    }
  }
