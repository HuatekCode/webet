'use strict';
/**
 * created by jackie on 2015/9/19
 * event type request data router
 */

var eventTypeController = require('../../service/eventtype/eventtype.controller');
module.exports = function (app) {
    app.get('/eventtypes/:id', eventTypeController.getItem);
    app.get('/eventtypes', eventTypeController.getItems);
};
