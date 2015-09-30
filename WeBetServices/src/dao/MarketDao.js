"use strict";

/**
 * Created by andre_zhang on 2015/9/19.
 */

var DaoBase = require('./DaoBase'),
    models = require('./../models/index'),
    marketModel = models.Market;

var marketDao = new DaoBase(marketModel);

marketDao.getAllDisplay = function(){
    return this.model.find({});
}

module.exports = marketDao;