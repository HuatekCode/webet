'use strict';
/**
 * created by jackie on 2015/9/24
 * provide API for data storage
 */

var eventTypeDao = require("../../dao/EventTypeDao"),
    competitionDao = require("../../dao/CompetitionDao"),
    eventDao = require("../../dao/EventDao"),
    marketDao = require("../../dao/MarketDao"),
    marketPriceDao = require("../../dao/MarketPriceDao"),
    originDataDao = require("../../dao/OriginDataDao.js"),//data daos of backup
    api = require('./api.js').apiHandler,
    params = {
        filter: {}
    },//call api get post data filter
    async = require('async'),
    loggerHandler = require('../../../logger.js').helper;


/**
 * set session token
 * @param st
 * @returns {setSessionToken}
 */
function setSessionToken(st) {
    this.sessionToken = st;
    return this;
}

/**
 * event type callback function of after get data
 * @param buffer
 * @param extendData
 */
function eventTypeDataManager(buffer, extendData) {
    loggerHandler.info('event types manageing ...');
    var data = JSON.parse(buffer.toString());
    async.series({
        one: function (callback) {
            //store data to db
            storeEventTypeDataToDb(data, null, callback);
        },
        two: function (callback) {
            //call next process function
            callCompetitionProcess(data);
            callback(null);
        }
    }, function (error, result) {
        loggerHandler.info('eventType process end');
    });
}

/**
 * store event type data to db
 * @param data
 * @param extendData
 * @param parentcallback
 */
function storeEventTypeDataToDb(data, extendData, parentcallback) {
    try {
        async.eachSeries(data.result, function (eventType, callback) {
            eventTypeDao.delete({'id': eventType.eventType.id}, function (error) {
                eventTypeDao.create({
                    id: eventType.eventType.id,
                    name: eventType.eventType.name
                }, function (doc) {
                    callback(null, doc);
                });
            });
        }, function (err) {
            loggerHandler.info('store event type data end.count=' + data.result.length);
            parentcallback ? parentcallback(err, null) : false;
            err ? loggerHandler.info("err: " + err) : false;
        });
    }
    catch (e) {
        parentcallback !== null ? parentcallback(e, null) : false;
        loggerHandler.info('store event type data error:' + e);
    }
}

/**
 * call competition process
 * @param data
 */
function callCompetitionProcess(data) {
    /*
        Now,we just need 'Soccer'
     */
    //data.result.forEach(function (eventType) {
    loggerHandler.info('competitions manageing ...');

    params.filter.eventTypeIds = [1];
    var extendData = {
        eventTypeId: 1
    };
    api.processCompetitions(params, competitionDataManager, null, extendData);
    //});
}

/**
 * competitions callback function of after get data
 * @param buffer
 * @param extendData
 */
function competitionDataManager(buffer, extendData) {
    var data = JSON.parse(buffer.toString());
    async.series({
        one: function (callback) {
            storeCompetitionDataToDb(data, extendData, callback);
        },
        two: function (callback) {
            callEventProcess(data);
            callback(null);
        }
    }, function (error, result) {
        loggerHandler.info('competition process end');
    });
}

/**
 * store competition data to db
 * @param data
 * @param extendData
 * @param parentcallback
 */
function storeCompetitionDataToDb(data, extendData, parentcallback) {
    try {
        async.eachSeries(data.result, function (competition, callback) {
            competitionDao.delete({'id': competition.competition.id}, function (error) {
                competitionDao.create({
                    id: competition.competition.id,
                    name: competition.competition.name,
                    eventTypeId: extendData.eventTypeId
                }, function (doc) {
                    callback(null, doc);
                });
            });
        }, function (err) {
            loggerHandler.info('store competition data end.count=' + data.result.length);
            parentcallback ? parentcallback(err, null) : false;
            err ? loggerHandler.info("err: " + err) : false;
        });
    }
    catch (e) {
        parentcallback ? parentcallback(e, null) : false;
        loggerHandler.info('store competition data error:' + e);
    }
}

/**
 * call event process
 * @param data
 */
function callEventProcess(data) {
    var compeitions = [];
    var count = 0;
    data.result.forEach(function (competition, index) {
        count += 1;
        compeitions.push(competition);
        if (count % 100 === 0 || (index === (data.result.length - 1))) {
            var tmpCompetitions = compeitions;
            setTimeout(function () {
                delayProcessEventType(tmpCompetitions);
            }, parseInt((count + 1) / 100) * 1000);
            compeitions = [];
        }
    });
}

/**
 * delay to send call api' request
 * @param data
 */
function delayProcessEventType(data) {
    data.forEach(function (competition, index) {
        var myDate = new Date(),
            fromTime = myDate.getUTCFullYear() + '-' + (parseInt(myDate.getUTCMonth()) + 1) + '-' + myDate.getUTCDate() + 'T00:00:00Z',
            toTime = myDate.getUTCFullYear() + '-' + (parseInt(myDate.getUTCMonth()) + 1) + '-' + myDate.getUTCDate() + 'T23:59:00Z';
        params.filter.competitionIds = [competition.competition.id];
        params.marketStartTime = {
            from: fromTime,
            to: toTime
        };
        var extendData = {
            eventTypeId: '1',
            competitionId: competition.competition.id
        };
        api.processEvents(params, eventDataManager, null, extendData);
    });
}

/**
 * event callback function of after get data
 * @param buffer
 * @param extendData
 */
function eventDataManager(buffer, extendData) {
    var data = JSON.parse(buffer.toString());
    async.series({
        one: function (callback) {
            storeEventDataToDb(data, extendData, callback);
        },
        two: function (callback) {
            callMarketProcess(data);
            callback(null);
        }
    }, function (error, result) {
        loggerHandler.info('event process end');
    });
}

/**
 * store event data to db
 * @param data
 * @param extendData
 * @param parentcallback
 */
function storeEventDataToDb(data, extendData, parentcallback) {
    try {
        async.eachSeries(data.result, function (event, callback) {
            eventDao.delete({'id': event.event.id}, function (error) {
                eventDao.create({
                    id: event.event.id,
                    name: event.event.name,
                    countryCode: event.event.countryCode,
                    timezone: event.event.timezone,
                    openDate: event.event.openDate,
                    eventTypeId: extendData.eventTypeId,
                    competitionId: extendData.competitionId
                }, function (doc) {
                    callback(null, doc);
                });
            });
        }, function (err) {
            parentcallback ? parentcallback(err, null) : false;
            err ? loggerHandler.info("err: " + err) : false;
        });
    }
    catch (e) {
        parentcallback !== null ? parentcallback(e, null) : false;
        loggerHandler.info('store event data error:' + e);
    }
}

/**
 * call market process
 * @param data
 */
function callMarketProcess(data) {
    var events = [];
    var count = 0;
    data.result.forEach(function (event, index) {
        count += 1;
        events.push(event);
        if (count % 100 === 0 || (index === (data.result.length - 1))) {
            var tmpEvents = events;
            setTimeout(function () {
                delayProcessEvent(tmpEvents);
            }, parseInt((count + 1) / 100) * 1000);
            events = [];
        }
    });
}

/**
 * delay to send call api' request
 * @param data
 */
function delayProcessEvent(data) {
    loggerHandler.info('market process ...');
    data.forEach(function (event, index) {
        params.filter.eventIds = [event.event.id];
        params.maxResults = '200';
        params.marketProjection = [
            'COMPETITION',
            'EVENT',
            'EVENT_TYPE',
            'RUNNER_DESCRIPTION',
            'RUNNER_METADATA',
            'MARKET_START_TIME'
        ];
        api.processMarkets(params, marketDataManager, null, null);
    });
}

/**
 * market callback function of after get data
 * @param buffer
 * @param extendData
 */
function marketDataManager(buffer, extendData) {
    var data = JSON.parse(buffer.toString());
    async.series({
        one: function (callback) {
            storeMarketDataToDb(data, extendData, callback);
        },
        two: function (callback) {
            callMarketPriceProcess(data);
            callback(null);
        }
    }, function (error, result) {
        loggerHandler.info('market process end');
    });
}

/**
 * store market data to db
 * @param data
 * @param extendData
 * @param parentcallback
 */
function storeMarketDataToDb(data, extendData, parentcallback) {
    try {
        async.eachSeries(data.result, function (market, callback) {
            marketDao.delete({'marketId': market.marketId}, function (error) {
                marketDao.create({
                    marketId: market.marketId,
                    marketName: market.marketName,
                    marketStartTime: market.marketStartTime,
                    totalMatched: market.totalMatched,
                    runners: market.runners,
                    eventTypeId: market.eventType.id,
                    competitionId: market.competition.id,
                    eventId: market.event.id
                }, function (doc) {
                    callback(null, doc);
                });
            });
        }, function (err) {
            if(data.result.length!==0) {
                console.log('market count = ' + data.result.length);
            }
            parentcallback ? parentcallback(err, null) : false;
            err ? loggerHandler.info("err: " + err) : false;
        });
    }
    catch (e) {
        parentcallback !== null ? parentcallback(e, null) : false;
        loggerHandler.info('store market data error:' + e);
    }
}

/**
 * call market book process
 * @param data
 */
function callMarketPriceProcess(data) {

    var localParams = {};
    localParams.marketIds = [];
    data.result.forEach(function (market, index) {
        localParams.marketIds.push(market.marketId);
    });

    if (localParams.marketIds.length > 0) {
        localParams.priceProjection = {
            priceData: ['EX_BEST_OFFERS']
        };
        api.processMarketBooks(localParams, marketPriceDataManager, null, null);
    }
}

/**
 * market book callback function of after get data
 * @param buffer
 * @param extendData
 */
function marketPriceDataManager(buffer, extendData) {
    var data = JSON.parse(buffer.toString());
    storeMarketPriceToDb(data, extendData, null);
}

/**
 * store market price to db
 * @param data
 * @param extendData
 * @param parentcallback
 */
function storeMarketPriceToDb(data, extendData, parentcallback) {
    try {
        async.eachSeries(data.result, function (marketBook, callback) {
            marketPriceDao.delete({'marketId': marketBook.marketId}, function (error) {
                marketPriceDao.create(marketBook, function (doc) {
                    callback(null, doc);
                });
            });
        }, function (err) {
            //loggerHandler.info('store market prices data end.count=' + data.result.length);
            parentcallback ? parentcallback(err, null) : false;
            err ? loggerHandler.info("err: " + err) : false;
        });
    }
    catch (e) {
        parentcallback !== null ? parentcallback(e, null) : false;
        loggerHandler.info('store market price data error:' + e);
    }
}

/**
 * entry to store data by call
 * todo:1. get data from url
 * 2.save data to origin collections
 * 3.if get all data correct,then move all data to un-origin collections
 * @param sessionToken
 * @returns {boolean}
 */
function storeData(sessionToken) {
    var config = require('../../../config.js');
    //app key
    if (config.APP_KEY === '') {
        loggerHandler.info('storeData: app key is empty');
        return false;
    }
    //session token
    if (sessionToken === '') {
        loggerHandler.info('storeData: session token is empty');
        return false;
    }
    //login url
    if (config.POST_URL === '') {
        loggerHandler.info('storeData: api post url is empty');
        return false;
    }

    async.series({
            bak1: function (callback) {
                backupEventTypes(callback);
            },
            bak2: function (callback) {
                backupCompetitions(callback);
            },
            bak3: function (callback) {
                backupEvents(callback);
            },
            bak4: function (callback) {
                backupMarkets(callback);
            },
            bak5: function (callback) {
                backupMarketPrices(callback);
            },
            callapi: function (callback) {
                api.setAppKey(config.APP_KEY)
                    .setSessionToken(sessionToken)
                    .setPostUrl(config.POST_URL)
                    .processEventTypes(params, eventTypeDataManager, null);
                callback(null, null);
            }
        }
        , function (error, result) {
            error ? loggerHandler.info('error=' + error) : false;
        });
}

/**
 * backup event types
 * @param callback
 */
function backupEventTypes(callback) {
    loggerHandler.info('backupEventTypes');
    originDataDao.originEventTypeDao.delete({}, function (err) {
        eventTypeDao.getAll(function (error, datas) {
            if (datas.length > 0) {
                originDataDao.originEventTypeDao.create(datas, function (error) {
                    callback(null);
                })
            } else {
                callback(null);
            }
        });
    });
}

/**
 * backup competitions
 * @param callback
 */
function backupCompetitions(callback) {
    loggerHandler.info('backupCompetitions');

//clear backup data
    originDataDao.originCompetitionDao.delete({}, function (err) {
        if (!err) {
            //get data of need to back
            competitionDao.getAll(function (error, datas) {
                if (datas.length > 0) {
                    //back data
                    originDataDao.originCompetitionDao.create(datas, function (error) {
                        callback(null);
                    });
                }
                else {
                    callback(null);
                }
            });
        }
    });
}

/**
 * backup events
 * @param callback
 */
function backupEvents(callback) {
    loggerHandler.info('backupEvents');
    originDataDao.originEventDao.delete({}, function (err) {
        if (!err) {
            eventDao.getAll(function (error, datas) {
                if (datas.length > 0) {
                    originDataDao.originEventDao.create(datas, function (error) {
                        callback(null);
                    });
                }
                else {
                    callback(null);
                }
            });
        }
    });
}

/**
 * backup markets
 * @param callback
 */
function backupMarkets(callback) {
    loggerHandler.info('backupMarkets');
    originDataDao.originMarketDao.delete({}, function (err) {
        if (!err) {
            marketDao.getAll(function (error, datas) {
                if (datas.length > 0) {
                    originDataDao.originMarketDao.create(datas, function (error) {
                        callback(null);
                    });
                } else {
                    callback(null);
                }
            });
        }
    });
}

/**
 * backup market prices
 * @param callback
 */
function backupMarketPrices(callback) {
    loggerHandler.info('backupMarketPrices');
    originDataDao.originMarketPriceDao.delete({}, function (err) {
        if (!err) {
            marketPriceDao.getAll(function (error, datas) {
                if (datas.length > 0) {
                    originDataDao.originMarketPriceDao.create(datas, function (error) {
                        callback(null);
                    });
                } else {
                    callback(null);
                }
            });
        }
    });
}

exports.storeData = storeData;
exports.setSessionToken = setSessionToken;
