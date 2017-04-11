var CONSTANTS = require('../constants');


/**
 *
 * Controller for editing workorders.
 *
 * @param $scope
 * @param mediator
 * @param workorderMediatorService
 * @param $stateParams
 * @param $q
 *
 * @constructor
 */
function WorkorderFormController($scope, mediator, workorderMediatorService, $stateParams, $q) {
  var self = this;
  var today = new Date();
  today.setHours(today.getHours()-24);
  $scope.today = today.toISOString();
  var maxDate = new Date();
  maxDate.setFullYear(today.getFullYear()+100);
  $scope.maxDate = maxDate.toISOString();
  self.submitted = false;

  //Need workorder, workflows, workers

  //If there is a workorder ID in the state URL, then we are editing a worokorder, otherwise we are creating a new one.
  var workorderPromise = $stateParams.workorderId ? workorderMediatorService.readWorkorder($stateParams.workorderId) : $q.when({location: []});
  var workflowsPromise = workorderMediatorService.listWorkflows();
  var workersPromise = workorderMediatorService.listUsers();

  self.selectWorkorder = function(event, workorder) {
    if (workorder.id) {
      mediator.publish('wfm:ui:workorder:selected', workorder);
    } else {
      mediator.publish('wfm:ui:workorder:list');
    }
    event.preventDefault();
    event.stopPropagation();
  };

  self.done = function(isValid) {
    self.submitted = true;
    if (isValid) {
      self.model.startTimestamp = new Date(self.model.startDate);
      self.model.startTimestamp.setHours(
        self.model.startTime.getHours(),
        self.model.startTime.getMinutes(),
        self.model.startTime.getSeconds(),
        self.model.startTime.getMilliseconds()
      );
      var workorderToCreate = JSON.parse(angular.toJson(self.model));

      var createUpdatePromise;
      if (!self.model.id && self.model.id !== 0) {
        createUpdatePromise = workorderMediatorService.createWorkorder(workorderToCreate);
      } else {
        createUpdatePromise = workorderMediatorService.updateWorkorder(workorderToCreate);
      }

      createUpdatePromise.then(function() {
        //Finished with the update/create, go back to the list.
        mediator.publish("wfm:ui:workorder:list");
      });
    }
  };


  //TODO: Error handling
  $q.all([workorderPromise, workflowsPromise, workersPromise]).then(function(results) {
    self.model = results[0];
    self.workflows = results[1];
    self.workers = results[2];


    if (self.model && self.model.startTimestamp) {
      self.model.startDate = new Date(self.model.startTimestamp);
      self.model.startTime = new Date(self.model.startTimestamp);
    }
  });
}

angular.module(CONSTANTS.WORKORDER_DIRECTIVE).controller('WorkorderFormController', ['$scope', 'mediator', 'workorderMediatorService', '$stateParams', '$q', WorkorderFormController]);