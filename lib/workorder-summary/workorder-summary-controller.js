var CONSTANTS = require('../constants');

function WorkorderSummaryController($mdDialog, mediator, $stateParams, workorderMediatorService, $q, WORKORDER_CONFIG) {
  var self = this;

  self.adminMode = WORKORDER_CONFIG.adminMode;

  //Need to read the workorder from the state parameter
  var workorderId = $stateParams.workorderId;

  var workorderPromise = workorderMediatorService.readWorkorder(workorderId);

  var workflowPromise = workorderPromise.then(function(workorder) {
    return workorderMediatorService.readWorkflow(workorder.workflowId);
  });

  var resultPromise = workorderPromise.then(function(workorder) {
    return $q.when(workorderMediatorService.resultMap().then(function(resultMap) {
      console.log("resultMap", resultMap);
      return resultMap[workorder.id];
    }));
  });

  var workerPromise = workorderPromise.then(function(workorder) {
    return workorderMediatorService.readUser(workorder.assignee);
  });

  //TODO: Error handling
  $q.all([workorderPromise, workflowPromise, resultPromise, workerPromise]).then(function(results) {
    console.log("All Done", results);
    self.workorder = results[0];
    self.workflow = results[1];
    self.result = results[2];
    self.assignee = results[3];
  }).catch(function(err) {
    console.log("ERROR", err);
  });

  self.delete = function(event, workorder) {

    if (!self.adminMode) {
      return;
    }

    event.preventDefault();
    var confirm = $mdDialog.confirm()
      .title('Would you like to delete workorder #'+workorder.title+'?')
      .textContent(workorder.title)
      .ariaLabel('Delete Workorder')
      .targetEvent(event)
      .ok('Proceed')
      .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      return workorderMediatorService.removeWorkorder(workorder)
        .then(function() {
          //Finished removing the workorder, go back to the list.
          mediator.publish('wfm:ui:workorder:list');
        }, function(err) {
          //TODO: Error Handling
          throw err;
        });
    });
  };
}


angular.module(CONSTANTS.WORKORDER_DIRECTIVE).controller('WorkorderSummaryController', ['$mdDialog', 'mediator', '$stateParams', 'workorderMediatorService', '$q', 'WORKORDER_CONFIG', WorkorderSummaryController]);