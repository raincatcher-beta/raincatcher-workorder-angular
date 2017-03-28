var CONSTANTS = require('../constants');
var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

var shortid = require('shortid');
// var q = require('q');

/**
 *
 * A mediator service that will publish and subscribe to topics to be able to render data.
 *
 * @param {Mediator} mediator
 * @param {object}   config
 * @constructor
 */
function WorkorderMediatorService(mediator, config) {
  this.mediator = mediator;
  this.config = config || {};

  this.workordersTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKORDER_ENTITY_NAME);
  this.usersTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.USERS_ENTITY_NAME);
  this.workflowsTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKFLOWS_ENTITY_NAME);
  this.resultsTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.RESULTS_ENTITY_NAME);
  this.workorderSyncSubscribers = new MediatorTopicUtility(mediator)
    .prefix(CONSTANTS.SYNC_TOPIC_PREFIX)
    .entity(CONSTANTS.WORKORDER_ENTITY_NAME);
}

/**
 *
 * Listing all workorders
 *
 * @returns {Promise}
 */
WorkorderMediatorService.prototype.listWorkorders = function listWorkorders() {
  return this.workordersTopics.execute(CONSTANTS.TOPICS.LIST, this.config);
};


/**
 *
 * Reading a single Workorder
 *
 * @param workorderId - The ID of the Workorder To Read
 * @returns {Promise}
 */
WorkorderMediatorService.prototype.readWorkorder = function readWorkorder(workorderId) {
  var payload = {
    id: workorderId,
    topicUid: workorderId
  };
  return this.workordersTopics.execute(CONSTANTS.TOPICS.READ, this.config, payload);
};

/**
 *
 * Creating a new Workorder
 *
 * @param {object} workorderToCreate - The Workorder To Create
 * @returns {Promise}
 */
WorkorderMediatorService.prototype.createWorkorder = function createWorkorder(workorderToCreate) {
  var payload = {
    workorderToCreate: workorderToCreate,
    topicUid: shortid.generate()
  };
  return workordersTopics.execute(CONSTANTS.TOPICS.CREATE, this.config, payload);
};

/**
 *
 * Updating A Single Workorder
 *
 * @param {object} workorderToUpdate - The Workorder To Create
 * @param {string} workorderToUpdate.id - The ID of the Workorder To Update
 * @returns {Promise}
 */
WorkorderMediatorService.prototype.updateWorkorder = function updateWorkorder(workorderToUpdate) {
  var payload = {
    workorderToUpdate: workorderToUpdate,
    topicUid: workorderToUpdate.id
  };
  return workordersTopics.execute(CONSTANTS.TOPICS.UPDATE, this.config, payload);
};

/**
 *
 * Removing A Single Workorder
 *
 * @param {object} workorderToRemove - The Workorder To Remove
 * @param {string} workorderToRemove.id - The ID of the workorder to remove.
 * @returns {Promise}
 */
WorkorderMediatorService.prototype.removeWorkorder = function removeWorkorder(workorderToRemove) {
  var payload = {
    id: workorderToRemove.id,
    topicUid: workorderToRemove.id
  };
  return workordersTopics.execute(CONSTANTS.TOPICS.REMOVE, this.config, payload);
};

/**
 *
 * Listing All Workflows
 *
 * @returns {Promise}
 */
WorkorderMediatorService.prototype.listWorkflows = function listWorkflows() {
  return workflowsTopics.execute(CONSTANTS.TOPICS.LIST, this.config, payload);
};


/**
 * Reading A single workflow
 * @param {string} workflowId
 * @returns {Promise}
 */
WorkorderMediatorService.prototype.readWorkflow = function readWorkflow(workflowId) {
  var payload = {
    id: workflowId,
    topicUid: workflowId
  };
  return workflowsTopics.execute(CONSTANTS.TOPICS.READ, this.config, payload);
};

/**
 *
 * Listing All Results
 *
 * @returns {Promise}
 */
WorkorderMediatorService.prototype.listResults = function listResults() {
  return resultsTopics.execute(CONSTANTS.TOPICS.LIST, this.config, payload);
};

/**
 *
 * Reading A Single User
 *
 * @param {string} userId - the ID of the user to read
 * @returns {Promise}
 */
WorkorderMediatorService.prototype.readUser = function readUser(userId) {
  var payload = {
    id: userId,
    topicUid: userId
  };
  return usersTopics.execute(CONSTANTS.TOPICS.READ, this.config, payload);
};

/**
 *
 * Listing All Users
 *
 * @returns {Promise}
 */
WorkorderMediatorService.prototype.listUsers = function listUsers() {
  return usersTopics.execute(CONSTANTS.TOPICS.LIST, this.config, payload);
};

/**
 *
 * Subscribing to any workorders list updates. This is useful if lists need to be refreshed.
 *
 * @param $scope - Passing the scope because the subscriber should be removed when the scope has been destroyed to avoid zombie subscribers.
 * @param {function} functionToExecute - The subscribing function to use when
 * @returns {Promise}
 */
WorkorderMediatorService.prototype.subscribeToListUpdated = function subscribeToListUpdated($scope, functionToExecute) {

  this.mediator.subscribeForScope(this.workorderSyncSubscribers.getTopic(CONSTANTS.TOPICS.DELTA_RECEIVED), $scope, functionToExecute);
};

/**
 *
 * Utility Function To Read all results and create a map for UI rendering.
 *
 * @returns {*}
 */
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

angular.module(CONSTANTS.WORKORDER_SERVICE, ['wfm.core.mediator']).service("workorderMediatorService", ['mediator', "WORKORDER_CONFIG", function(mediator, WORKORDER_CONFIG) {
  return new WorkorderMediatorService(mediator, WORKORDER_CONFIG);
}]);

module.exports = CONSTANTS.WORKORDER_SERVICE;