'use strict';
/**
 * created by jackie on 2015/9/19
 * market price request data router
 */

var marketPriceController = require('../../service/marketprice/marketprice.controller');
module.exports = function (app) {
    app.get('/marketprices/:id', marketPriceController.getItem);
    app.get('/marketprices', marketPriceController.getItems);
};