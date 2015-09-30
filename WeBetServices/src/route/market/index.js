'use strict';
/**
 * created by jackie on 2015/9/19
 * market request data router
 */
var marketController = require('../../service/market/market.controller');
module.exports = function (app) {
    app.get('/markets/:id', marketController.getItem);
    app.get('/markets', marketController.getItems);
};
