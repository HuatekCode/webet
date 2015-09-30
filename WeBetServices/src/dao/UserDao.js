"use strict";

/**
 * Created by andre_zhang on 2015/9/19.
 */

var DaoBase = require('./DaoBase'),
    models = require('./../models/index'),
    userModel = models.User;

var userDao = new DaoBase(userModel);

module.exports = userDao;