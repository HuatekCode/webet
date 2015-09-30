'use strict';
/**
 * created by jackie on 2015/9/19
 * event request data router
 */

var eventController = require('../../service/event/event.controller');
module.exports = function (app) {
    app.get('/events/:id', eventController.getItem);
    app.get('/events', eventController.getItems);
};
