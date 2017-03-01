var CONSTANTS = require('../constants');


angular.module(CONSTANTS.WORKORDER_DIRECTIVE).config(['$stateProvider', 'WORKORDER_CONFIG', function($stateProvider, WORKORDER_CONFIG) {

  var views = {};

  //If we are in admin mode, bind the list and detail view to the passed IDs
  if (WORKORDER_CONFIG.adminMode) {
    views[WORKORDER_CONFIG.listColumnViewId] = {
      template: '<workorder-list></workorder-list>'
    };

    views[WORKORDER_CONFIG.detailColumnId] = {
      templateProvider: function($templateCache) {
        return $templateCache.get('wfm-template/empty.tpl.html');
      }
    };
  } else {
    views[WORKORDER_CONFIG.detailColumnId] = {
      template: '<workorder-list></workorder-list>'
    };
  }

  var workorderListStateConfig = {
    url: '/workorders/list',
    views: views
  };

  $stateProvider.state('app.workorder', workorderListStateConfig);
}]);
