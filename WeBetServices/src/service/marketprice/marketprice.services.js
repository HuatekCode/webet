"use strict"
/**
 * Created by andre zhang on 2015/9/22.
 */
var marketPriceDao = require("../../dao/MarketPriceDao");
var Paginate = require("../../dao/Paginate");
var logger = require('../../../logger').helper;

/**
 * return market price
 * @param filter
 * @param page
 * @param per_page
 * @param callback
 */
var getItemsByFilter = function (filter, page, per_page, callback) {
    if (page === null || typeof page === 'undefined' || per_page === null || typeof per_page === 'undefined') {
        marketPriceDao.getByQuery(filter, function (err, marketprics) {
            callback(err, marketprics);
        });
    } else {
        var paginate = new Paginate(page, per_page);
        marketPriceDao.findPagination(filter, paginate, 'marketName', function (err, paginate) {
            callback(err, paginate);
        });
    }
};
exports.getItemsByFilter = getItemsByFilter;

/**
 *  return market price by id
 * @param marketId
 * @param callback
 */
var getItemByID = function (marketId, callback) {
    marketPriceDao.getByQuery({'marketId': marketId}, function (err, marketprice) {
        callback(err, marketprice);
    });
};
exports.getItemByID = getItemByID;