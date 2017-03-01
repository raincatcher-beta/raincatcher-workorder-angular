var CONSTANTS = require('../constants');

/**
 *
 * Controller for displaying workorder details to the user.
 * @param $scope
 * @param mediator
 * @param WORKORDER_CONFIG
 * @constructor
 */
function WorkorderDetailController($scope, mediator, WORKORDER_CONFIG) {
  var self = this;

  self.adminMode = WORKORDER_CONFIG.adminMode;

  self.selectWorkorder = function(event, workorder) {
    if (workorder.id) {
      mediator.publish('wfm:workorder:selected', workorder);
    } else {
      mediator.publish('wfm:workorder:list');
    }

    event.preventDefault();
    event.stopPropagation();
  };
}


angular.module(CONSTANTS.WORKORDER_DIRECTIVE).controller('WorkorderDetailController', ["$scope", "mediator", 'WORKORDER_CONFIG', WorkorderDetailController]);