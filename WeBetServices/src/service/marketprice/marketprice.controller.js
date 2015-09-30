"use strict"
/**
 * Created by andre zhang on 2015/9/22.
 */
var marketPriceService = require('./marketprice.services');
var config = require('../../../config.js');
var logger = require('../../../logger').helper;

/**
 * return available market price
 * @param req  http request
 * @param res  http response
 * @param callback
 */
function getItems(req, res, callback) {
    var pid = req.query.pid;
    var name = req.query.name;
    var page = req.query.page;
    var per_page = (req.query.per_page === null || typeof req.query.per_page === 'undefined') ? config.perPage : req.query.per_page;

    var filter = {};
    if (pid !== null && pid !== '' && typeof pid !== 'undefined') {
        filter['eventId'] = pid;
    }
    if (name !== null && name !== '' && typeof name !== 'undefined') {
        filter['name'] = name;
    }
    logger.info(' filter=' + JSON.stringify(filter) + ', name' + name + ', page=' + page + ', per_page=' + per_page);
    marketPriceService.getItemsByFilter(filter, page, per_page, function (err, datas) {
        if (err)
            return res.json({err: err});
        res.json(datas);
    });
}

/**
 * return market price by id
 * @param req  http request
 * @param res  http response
 * @param callback
 */
function getItem(req, res, callback) {
    logger.info(' marketprice id=' + req.params.id);
    marketPriceService.getItemByID(req.params.id, function (err, datas) {
        if (err)
            return res.json({err: err});
        res.json(datas);
    });
}

exports.getItems = getItems;
exports.getItem = getItem;