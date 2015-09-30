"use strict";

/**
 * Created by andre_zhang on 9/19/2015.
 * market controller
 */
var marketService = require('./market.services');
var config = require('../../../config.js');
var logger = require('../../../logger').helper;

/**
 * return available markets
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

    logger.info(' filter=' + JSON.stringify(filter) + ', name' + name + ', page=' + page + ', per_page=' + per_page);
    marketService.getAvailableItemsByFilter(filter, function (err, datas) {
        if (err)
            return res.json({err: err});
        res.json(datas);
    });
}

/**
 * return market by id
 * @param req  http request
 * @param res  http response
 * @param callback
 */
function getItem(req, res, callback) {
    logger.info(' market id=' + req.params.id);
    marketService.getItemByID(req.params.id, function (err, datas) {
        if (err)
            return res.json({err: err});
        res.json(datas);
    });
}

exports.getItems = getItems;
exports.getItem = getItem;