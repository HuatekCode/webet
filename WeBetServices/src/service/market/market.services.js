"use strict";

/**
 * Created by andre_zhang on 9/19/2015.
 * market service
 */
var marketDao = require("../../dao/MarketDao");
var marketPriceDao = require("../../dao/MarketPriceDao");
var Paginate = require("../../dao/Paginate");
var availableDao = require("../../dao/AvailableDao");
var logger = require('../../../logger').helper;

/**
 * return available markets
 * @param filter
 * @param callback
 */
var getAvailableItemsByFilter = function (filter, callback) {
    availableDao.distinctFiled('marketId', function(err, data){
        if(err)
            callback(err,callback);
        filter['marketId'] = {'$in' : data};
        getMarketsByEvent(filter, callback);
    })
};
exports.getAvailableItemsByFilter = getAvailableItemsByFilter;

/**
 * return markets
 * @param filter
 * @param page
 * @param per_page
 * @param callback
 */
var getItemsByFilter = function (filter, page, per_page, callback) {
    if (page === null || typeof page === 'undefined' || per_page === null || typeof per_page === 'undefined') {
        marketDao.getByQuery(filter, function (err, markets) {
            callback(err, markets);
        });
    } else {
        var paginate = new Paginate(page, per_page);
        marketDao.findPagination(filter, paginate, 'marketName', function (err, paginate) {
            callback(err, paginate);
        });
    }
};
exports.getItemsByFilter = getItemsByFilter;

/**
 *  return market by id
 * @param marketId
 * @param callback
 */
var getItemByID = function (marketId, callback) {
    marketDao.getByQuery({'marketId': marketId}, function (err, market) {
        callback(err, market);
    });
};
exports.getItemByID = getItemByID;
/**
 *  return market and price
 * @param eventId
 * @param callback
 */
var getMarketsByEvent = function(filter, callback) {
    marketDao.getByQuery(filter,function(err1, data1){
        if(err1)
            callback(err1,null);
        marketPriceDao.getByQuery({'marketId' : filter['marketId']},function(err2, data2){
            if(err2)
                callback(err2,null);
            callback(null,processMarksData(data1, data2));
        })
    });
};

exports.getMarketsByEvent = getMarketsByEvent;

/**
 * process market and price
 * @param markets
 * @param prices
 * @returns {Array}
 */
var processMarksData = function(markets, prices){
    var data = [], // return data
        market = {}, // market
        marketPrice = {}, //market price
        cell = {}; // price
    if(markets === null || prices === null) return data;

    for(var i = 0; i < markets.length; i++) {
        market =  markets[i];
        if(market === null) continue;
        for(var j = 0; j < prices.length; j++) {
            marketPrice = prices[j];
            if(marketPrice === null) continue;
            if( market['marketId'] === marketPrice['marketId']) {
                cell = buildMarketData(market, marketPrice);
                break;
            }
        }
        if(cell !== null){
            data.push(cell);
        }
    }
    return data;
};

/**
 * combine market and price
 * @param market
 * @param marketPrice
 * @returns {{}}
 */
var buildMarketData = function(market, marketPrice){
    var cell = {}, //return data \
        runner = {},
        runners = [],
        runners1 = [],
        runners2 = [];

    if(market === null || marketPrice === null) return cell;

    runners1 = market['runners'];
    runners2 = marketPrice['runners'];

    if(runners1 == null || runners2 == null) return cell;

    cell['marketId'] = market['marketId'];
    cell['marketName'] = market['marketName'];
    cell['marketStartTime'] = market['marketStartTime'];

    for(var i = 0; i < runners1.length; i++) {
        runner = {};
        runner['selectionId'] = runners1[i]['selectionId'];
        runner['runnerName'] = runners1[i]['runnerName'];
        var handicap = runners1[i]['handicap'];
        if(handicap !== null && handicap !== '' && handicap !== '0' && handicap !== 0){
            if(handicap.indexOf('+') !== 0 && handicap.indexOf('-') !== 0) handicap = '+' + handicap;
            runner['handicap'] = handicap;
        }
        for(var j = 0; j < runners2.length; j++) {
            if(runners1[i]['selectionId'] === runners2[j]['selectionId']){
                runner['ex'] = runners2[j]['ex'];
                break;
            }
        }
        runners.push(runner);
    }
    cell['runners'] = runners;

    return cell;
};