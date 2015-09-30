"use strict";

/**
 * Created by andre_zhang on 2015/9/22.
 */
var DaoBase = require('./DaoBase'),
    models = require('./../models/index'),
    marketPriceModel = models.MarketPrice;

var marketPriceDao = new DaoBase(marketPriceModel);

module.exports = marketPriceDao;