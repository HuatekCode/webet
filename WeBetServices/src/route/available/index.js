"use strict"

/**
 * Created by andre_zhang on 2015/9/22.
 */
var availableController = require('../../service/available/available.controller');
module.exports = function (app) {
    app.all('/availableSave', availableController.availableSave);
};