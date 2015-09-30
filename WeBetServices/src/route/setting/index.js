"use strict"

/**
 * Created by andre_zhang on 2015/9/22.
 */
var settingController = require('../../service/setting/setting.controller');
module.exports = function (app) {
    app.get('/admin/setting/eventTypeTree', settingController.getEventTypeTrees);
};