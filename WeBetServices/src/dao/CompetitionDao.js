"use strict";

/**
 * Created by andre_zhang on 2015/9/22.
 */
var DaoBase = require('./DaoBase'),
    models = require('./../models/index'),
    competitionModel = models.Competition;
var competitionDao = new DaoBase(competitionModel);

module.exports = competitionDao;