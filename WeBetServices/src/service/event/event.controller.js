"use strict";
/**
 * Created by andre_zhang on 9/19/2015.
 * event controller
 */
var eventService = require('./event.services');
var config = require('../../../config.js');
var logger = require('../../../logger').helper;

/**
 * return available events
 * @param req  http request
 * @param res  http response
 * @param callback
 */
function getItems(req, res, callback) {
    var pid = req.query.pid;
    var name = req.query.name;
    var keyword = req.query.keyword;
    var page = req.query.page;
    var per_page = (req.query.per_page === null || typeof req.query.per_page === 'undefined') ? config.perPage : req.query.per_page;

    var filter = {};
    if (pid !== null && pid !== '' && typeof pid !== 'undefined') {
        filter['competitionId'] = pid;
    }
    if (name !== null && name !== '' && typeof name !== 'undefined') {
        filter['name'] = name;
    }
    //keyword search
    if (keyword !== null && keyword !== '' && typeof keyword !== 'undefined') {
        filter['name'] = new RegExp(keyword, 'i');
    }
    logger.info(' filter=' + JSON.stringify(filter) + ', name' + name + ', page=' + page + ', per_page=' + per_page);
    eventService.getAvailableItemsByFilter(filter, page, per_page, function (err, datas) {
        if (err)
            return res.json({err: err});
        res.json(datas);
    });
}

/**
 * return event by id
 * @param req  http request
 * @param res  http response
 * @param callback
 */
function getItem(req, res, callback) {
    logger.info(' event id=' + req.params.id);
    eventService.getItemByID(req.params.id, function (err, competition) {
        if (err) {
            return res.json({err: err});
        }
        res.send(competition)
    });
}

exports.getItems = getItems;
exports.getItem = getItem;