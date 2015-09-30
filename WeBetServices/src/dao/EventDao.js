"use strict";

/**
 * Created by andre_zhang on 2015/9/19.
 */

var DaoBase = require('./DaoBase'),
    models = require('./../models/index'),
    eventModel = models.Event;

var eventDao = new DaoBase(eventModel);

module.exports = eventDao;