"use strict";

/**
 * Created by andre_zhang on 2015/9/22.
 */
var DaoBase = require('./DaoBase'),
    models = require('./../models/index'),
    available = models.Available;
var availableDao = new DaoBase(available);

module.exports = availableDao;