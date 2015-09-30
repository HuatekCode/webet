"use strict";

/**
 * Created by andre_zhang on 2015/9/19.
 */

var DaoBase = require('./DaoBase'),
    models = require('./../models/index'),
    eventTypeModel = models.EventType;

var eventTypeDao = new DaoBase(eventTypeModel);

module.exports = eventTypeDao;