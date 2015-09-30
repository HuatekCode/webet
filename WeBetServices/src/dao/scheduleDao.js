"use strict";

/**
 * Created by benjamin on 2015/9/22.
 */
var DaoBase = require('./DaoBase'),
    models = require('./../models/index'),
    scheduleModel = models.Schedule;

var scheduleDao = new DaoBase(scheduleModel);

module.exports = scheduleDao;