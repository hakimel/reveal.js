<?php
/**
 * @file
 * Contains \Drupal\ajax_dblog\Routing\RouteSubscriber.
 */

namespace Drupal\ajax_dblog\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

class RouteSubscriber extends RouteSubscriberBase {
  /**
   * {@inheritdoc}
   */
  public function alterRoutes(RouteCollection $collection) {
    // Change controller of '/admin/reports/dblog'
    if ($route = $collection->get('dblog.overview')) {
      $route->setDefault('_controller','\Drupal\ajax_dblog\Controller\DbLogController::overview');
    }
  }
}