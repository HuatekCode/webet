"use strict"

/**
 * Created by ben on 2015/9/20.
 */
var scheduleController = require('../../service/schedule/schedule.controller');
module.exports = function (app) {
    app.all('/schedule', scheduleController.createSchedule)
        .get('/schedule/updateNowSchedule', scheduleController.updateNowSchedule)
        .get('/schedule/cancelSchedule', scheduleController.cancelSchedule)
        .get('/schedule/getAvailableSchedule', scheduleController.getAvailableSchedule);
};