"use strict";
/**
 * Created by andre_zhang on 9/19/2015.
 * competition controller
 */
var competitionService = require('./competition.services');
var config = require('../../../config.js');
var logger = require('../../../logger').helper;

/**
 * return available competitions
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
        filter['eventTypeId'] = pid;
    }
    if (name !== null && name !== '' && typeof name !== 'undefined') {
        filter['name'] = name;
    }

    logger.info(' filter=' + JSON.stringify(filter) + ', name' + name + ', page=' + page + ', per_page=' + per_page);
    competitionService.getAvailableItemsByFilter(filter, page, per_page, function (err, competitions) {
        if (err)
            return res.json({err: err});
        res.send(competitions);
    });
}

/**
 * return competition by id
 * @param req  http request
 * @param res  http response
 * @param callback
 */
function getItem(req, res, callback) {
    logger.info(' competition id=' + req.params.id);
    competitionService.getItemByID(req.params.id, function (err, competition) {
        if (err) {
            return res.json({err: err});
        }
        res.send(competition)
    });
}

exports.getItems = getItems;
exports.getItem = getItem;