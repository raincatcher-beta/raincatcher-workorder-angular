# Raincatcher Workorder Angular User Interface

This module is an AngularJS 1 implementation of Workorders for the Raincatcher project.

## Setup

This module is packaged in a CommonJS format, exporting the name of the Angular namespace.  The module can be included in an angular.js as follows:

```javascript

angular.module('app', [
...
, require('fh-wfm-workorder-angular')(config)
...
])
```

### Configuration Options


### Workorder directives

| Name | Attributes |
| ---- | ----------- |
| workorder-list | workorders, resultMap, selectedModel |
| workorder | workorder, assignee, status |
| workorder-form | value, workflows, workers |
| workorder-status | status |
| workorder-submission-result | result, step |

## Topics

As part of rendering Workorders, this module publishes and subscribes to several topics. These topics can be implemented in your application or you can use the fh-wfm-workorder module that already has implementations for these topics.

### Published Topics


