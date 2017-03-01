var CONSTANTS = require('../constants');
var shortid = require('shortid');
var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

function WorkorderMediatorService(mediator) {
  this.mediator = mediator;

  this.workordersTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKORDER_ENTITY_NAME);
  this.usersTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.USERS_ENTITY_NAME);
  this.workflowsTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKFLOWS_ENTITY_NAME);
  this.resultsTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.RESULTS_ENTITY_NAME);
}

WorkorderMediatorService.prototype.listWorkorders = function listWorkorders() {
  var workorderListPromise = this.mediator.promise(this.workordersTopics.getTopic(CONSTANTS.TOPICS.LIST, CONSTANTS.DONE_PREFIX));

  this.mediator.publish(this.workordersTopics.getTopic(CONSTANTS.TOPICS.LIST));

  return workorderListPromise;
};

WorkorderMediatorService.prototype.readWorkorder = function readWorkorder(workorderId) {
  var workorderReadPromise = this.mediator.promise(this.workordersTopics.getTopic(CONSTANTS.TOPICS.READ, CONSTANTS.DONE_PREFIX, workorderId));

  this.mediator.publish(this.workordersTopics.getTopic(CONSTANTS.TOPICS.READ), {id: workorderId, topicUid: workorderId});

  return workorderReadPromise;
};

WorkorderMediatorService.prototype.listWorkflows = function listWorkflows() {
  var workflowListPromise = this.mediator.promise(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.LIST, CONSTANTS.DONE_PREFIX));

  this.mediator.publish(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.LIST));

  return workflowListPromise;
};

WorkorderMediatorService.prototype.createWorkorder = function createWorkorder(workorderToCreate) {
  var topicUid = shortid.generate();

  var workorderCreatePromise = this.mediator.promise(this.workordersTopics.getTopic(CONSTANTS.TOPICS.CREATE, CONSTANTS.DONE_PREFIX, topicUid));

  this.mediator.publish(this.workordersTopics.getTopic(CONSTANTS.TOPICS.CREATE), {
    workorderToCreate: workorderToCreate,
    topicUid: topicUid
  });

  return workorderCreatePromise;
};

WorkorderMediatorService.prototype.updateWorkorder = function updateWorkorder(workorderToUpdate) {
  var workorderUpdatePromise = this.mediator.promise(this.workordersTopics.getTopic(CONSTANTS.TOPICS.UPDATE, CONSTANTS.DONE_PREFIX, workorderToUpdate.id));

  this.mediator.publish(this.workordersTopics.getTopic(CONSTANTS.TOPICS.UPDATE), {
    workorderToUpdate: workorderToUpdate,
    topicUid: workorderToUpdate.id
  });

  return workorderUpdatePromise;
};

WorkorderMediatorService.prototype.removeWorkorder = function removeWorkorder(workorderToRemove) {
  var workorderUpdatePromise = this.mediator.promise(this.workordersTopics.getTopic(CONSTANTS.TOPICS.REMOVE, CONSTANTS.DONE_PREFIX, workorderToRemove.id));

  this.mediator.publish(this.workordersTopics.getTopic(CONSTANTS.TOPICS.REMOVE), {
    id: workorderToRemove.id,
    topicUid: workorderToRemove.id
  });

  return workorderUpdatePromise;
};


WorkorderMediatorService.prototype.readWorkflow = function readWorkflow(workflowId) {
  var workflowReadPromise = this.mediator.promise(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.READ, CONSTANTS.DONE_PREFIX, workflowId));

  this.mediator.publish(this.workflowsTopics.getTopic(CONSTANTS.TOPICS.READ), {id: workflowId, topicUid: workflowId});

  return workflowReadPromise;
};

WorkorderMediatorService.prototype.listResults = function listResults() {
  var resultListPromise = this.mediator.promise(this.resultsTopics.getTopic(CONSTANTS.TOPICS.LIST, CONSTANTS.DONE_PREFIX));

  this.mediator.publish(this.resultsTopics.getTopic(CONSTANTS.TOPICS.LIST));

  return resultListPromise;
};

WorkorderMediatorService.prototype.readUser = function readUser(userId) {
  var userReadPromise = this.mediator.promise(this.usersTopics.getTopic(CONSTANTS.TOPICS.READ, CONSTANTS.DONE_PREFIX, userId));

  this.mediator.publish(this.usersTopics.getTopic(CONSTANTS.TOPICS.READ), {id: userId, topicUid: userId});

  return userReadPromise;
};

WorkorderMediatorService.prototype.listUsers = function listUsers() {
  var userListPromise = this.mediator.promise(this.usersTopics.getTopic(CONSTANTS.TOPICS.LIST, CONSTANTS.DONE_PREFIX));

  this.mediator.publish(this.usersTopics.getTopic(CONSTANTS.TOPICS.LIST));

  return userListPromise;
};

WorkorderMediatorService.prototype.resultMap = function() {
  return this.listResults()
    .then(function(results) {
      var map = {};
      results.forEach(function(result) {
        map[result.workorderId] = result;
      });
      return map;
    });
};

angular.module(CONSTANTS.WORKORDER_SERVICE, ['wfm.core.mediator']).service("workorderMediatorService", ['mediator', function(mediator) {
  return new WorkorderMediatorService(mediator);
}]);

module.exports = CONSTANTS.WORKORDER_SERVICE;