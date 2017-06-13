'use strict';
var CONSTANTS = require('./constants');


module.exports = function(config) {
  config = config || {};

  console.log("config", config);

  angular.module(CONSTANTS.WORKORDER_MODULE_ID, [
    require('angular-messages'),
    require('angular-ui-router'),
    'wfm.core.mediator',
    require('./mediator-service'),
    require('./directive')(config)
  ]);

  require('./initialisation');

  return 'wfm.workorder';
};


