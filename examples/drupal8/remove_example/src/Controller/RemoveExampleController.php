<?php
/**
 * @file
 * Contains \Drupal\remove_example\Controller\RemoveExampleController
 */

namespace Drupal\remove_example\Controller;

use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\Core\Controller\ControllerBase;
// Need to include AjaxResponse Class.
use Drupal\Core\Ajax\AjaxResponse;
// Need to include RemoveCommand class for callback.
use Drupal\Core\Ajax\RemoveCommand;
// Need to include custom SlideRemove custom command for callback.
use Drupal\remove_example\Ajax\SlideRemoveCommand;

/**
 * Class RemoveExampleController
 * @package Drupal\remove_example\Controller
 */
class RemoveExampleController extends ControllerBase {

  /**
   * Return output for displaying an image and ajax link for removing it.
   *
   * @param bool|TRUE $show_image
   *   Boolean value to display image and remove link or not.
   *
   * @return mixed
   *   Render array.
   */
  public static function demo($show_image = TRUE) {
    // Create some description text.
    $output['description']['#markup'] = '<p>' . t('The following is an example of using the remove ajax callback command.') . '</p>';
    // Boolean check to see if image should be rendered.
    // This is used as part of graceful degradation for a failed AJAX request.
    if ($show_image) {
      // Create image url.
      $img_url = Url::fromUri('base:/' . drupal_get_path('module', 'remove_example') . '/images/sample.jpg');
      // Build img tag.
      $img = array(
        '#type' => 'html_tag',
        '#tag' => 'img',
        '#attributes' => array(
          'src' => $img_url->toString(),
          'title' => t('Remove Image'),
          'alt' => t('Remove Image'),
        ),
      );
      // Build route parameters. Requires a 'method'. use 'nojs'. The ajax
      // library will replace this value with 'ajax' in all ajax request.
      $parameters = array(
        'method' => 'nojs',
      );
      // Build link options. Add class 'use-ajax' so ajax library knows to make
      // and ajax request.
      $options = array(
        'attributes' => array(
          'class' => array('use-ajax'),
        ),
      );
      // Build remove link from route.
      $remove = Link::createFromRoute(t('Remove Image'), 'remove_example.remove', $parameters, $options);

      // Build wrapper container.
      $output['wrapper'] = array(
        '#type' => 'container',
        '#attributes' => array(
          'id' => 'example_remove_wrapper',
        ),
        'remove' => $remove->toRenderable(),
        'spacer' => array('#markup' => '<br />'),
        'image' => $img,
      );

      // Attach the core Drupal ajax library.
      // $output['#attached']['library'][] = 'core/drupal.ajax';
      // Attach custom library to use custom callback command.
      $output['#attached']['library'][] = 'remove_example/remove-example';
    }
    // Return render array.
    return $output;
  }

  /**
   * Callback method for removing image from 'remove-example' page.
   *
   * @param $method
   *   The method used in the request of this page.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse|mixed
   */
  public static function remove($method = 'nojs') {
    // Part of graceful degradation, check to see if request method was 'ajax'.
    if ($method == 'ajax') {
      // Create a new AjaxResponse object.
      $response = new AjaxResponse();
      // Create and add instance of core Remove command.
      //$response->addCommand(new RemoveCommand('#example_remove_wrapper'));
      // Create and add instance of custom SlideRemoveCommand.
      $response->addCommand(new SlideRemoveCommand('#example_remove_wrapper', 'slow'));
      return $response;
    }
    // Non-ajax call to this callback.
    else {
      // Return output of demo method, without showing image.
      return self::demo(FALSE);
    }
  }
}