"use strict";

/**
 * Created by andre_zhang on 2015/9/22.
 */
var DaoBase = require('./DaoBase'),
    models = require('./../models/index'),
    originEventTypeModel = models.OriginEventType,
    originCompetition = models.OriginCompetition,
    originEventModel = models.OriginEvent,
    originMarketModel = models.OriginMarket,
    originMarketPriceModel = models.OriginMarketPrice;

var originEventTypeDao = new DaoBase(originEventTypeModel);
var originCompetitionDao = new DaoBase(originCompetition);
var originEventDao = new DaoBase(originEventModel);
var originMarketDao = new DaoBase(originMarketModel);
var originMarketPriceDao = new DaoBase(originMarketPriceModel);

exports.originEventTypeDao = originEventTypeDao;
exports.originCompetitionDao = originCompetitionDao;
exports.originEventDao = originEventDao;
exports.originMarketDao = originMarketDao;
exports.originMarketPriceDao = originMarketPriceDao;

