<?php
/**
 * @file
 * Contains \Drupal\ajax_dblog\Controller\DbLogController.php
 */

namespace Drupal\ajax_dblog\Controller;

// Include command classes that will be used.
use Drupal\slide_down\Ajax\SlideDownCommand;
use Drupal\Core\Ajax\AfterCommand;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\RemoveCommand;
use Drupal\Core\Link;
use Drupal\Core\Url;
use \Drupal\dblog\Controller\DbLogController as ControllerBase;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Returns responses for ajax_dblog routes.
 */
class DbLogController extends ControllerBase {

  /**
   * Override overview() method.
   */
  public function overview() {
    // Call the parent overview method.
    $build = parent::overview();
    // Alter the links for each log message.
    foreach ($build['dblog_table']['#rows'] as &$row) {
      // Get the rendered event link.
      $link = $row['data'][3]->getGeneratedLink();
      // Get wid from link.
      $wid = array();
      preg_match('/^.+event\/(\d+).*$/', $link, $wid);
      $wid = trim(array_pop($wid));
      // Have a valid numeric wid?
      if (is_numeric($wid)) {
        // Get link text.
        $text = trim(strip_tags($link));
        // Build route parameters.
        $parameters = array(
          'event_id' => $wid,
          // Set method to 'nojs' (will be replaced with 'ajax' during requests).
          'method' => 'nojs',
        );
        // Build link options.
        $options = array(
          'attributes' => array(
            // Add 'use-ajax' as class to link to utilize Ajax API.
            'class' => array('use-ajax', 'dblog-event-link'),
            'data-event-id' => $wid,
            'title' => $text,
          )
        );
        // Replace with a new link.
        $row['data'][3] = Link::createFromRoute($text, 'ajax_dblog.event', $parameters, $options);
        // Add an id to the row.
        $row['id'] = 'dblog-event-' . $wid;
      }
    }
    // Add custom library (will add ajax and commands).
    $build['#attached']['library'][] = 'ajax_dblog/ajax-dblog';
    return $build;
  }

  /**
   * Return details about a specific database log message.
   *
   * @param $method
   *   The method used in the request of this page.
   *
   * @param int $event_id
   *  Unique ID of the database log message.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   *  AJAX response of commands for adding to dblog table.
   */
  public function ajaxEventDetails($method, $event_id) {
    $response = array();
    $redirect = TRUE;

    // Get url to original event detail page.
    $event_url = Url::fromRoute('dblog.event', array('event_id' => $event_id));
    // Using ajax?
    if ($method == 'ajax') {
      $redirect = FALSE;
      // Get the details of the logged event.
      $event = parent::eventDetails($event_id);
      // Valid event?
      if (!empty($event)) {
        // Add link to event detail page to event.
        $event_link = Link::fromTextAndUrl($event_url->toString(), $event_url);
        $event['dblog_table']['#rows'][] = array(
          array('data' => $this->t('Event Log'), 'header' => TRUE),
          array('data' => $event_link),
        );
        // Build render array for event details.
        $event_details = array(
          '#theme' => 'ajax_dblog_event',
          '#event' => $event,
          '#event_id' => $event_id,
          '#row_id' => 'dblog-event-row-' . $event_id,
          '#details_id' => 'dblog-event-details-' . $event_id,
        );

        // Create an AjaxResponse.
        $response = new AjaxResponse();
        // Remove old event details.
        $response->addCommand(new RemoveCommand('.dblog-event-row'));
        // Insert event details after event.
        $response->addCommand(new AfterCommand('#dblog-event-' . $event_id, $event_details));
        // SlideDown event details.
        $response->addCommand(new SlideDownCommand('#dblog-event-details-' . $event_id));
      }
    }

    // Not using Ajax or failed to retrieve log event details.
    if ($redirect) {
      // Redirect to actual page.
      $response = new RedirectResponse($event_url->toString(), 302);
    }

    return $response;
  }

}