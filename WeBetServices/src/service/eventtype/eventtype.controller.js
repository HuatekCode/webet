"use strict";
/**
 * Created by andre_zhang on 9/19/2015.
 * event type controller
 */
var eventTypeService = require('./eventtype.services');
var config = require('../../../config.js');
var logger = require('../../../logger').helper;

/**
 * return available event types
 * @param req  http request
 * @param res  http response
 * @param callback
 */
function getItems(req, res, callback) {
    var name = req.query.name;
    var except = req.query.except;
    var page = req.query.page;
    var per_page = (req.query.per_page === null || typeof req.query.per_page === 'undefined') ? config.perPage : req.query.per_page;

    var filter = {};
    //soccer
    if(name !== null && name !== '' && name !== 'undefined'){
        if(except !== null && except === '1' && except !== 'undefined'){
            filter['name'] = {'$ne':name}; //  except soccer
        } else {
            filter['name'] = name; //soccer
        }
    }

    logger.info(' filter=' + JSON.stringify(filter) + ', name' + name + ', page=' + page + ', per_page=' + per_page);
    eventTypeService.getAvailableItemsByFilter(filter, page, per_page, function (err, data) {
        if (err)
            return res.json({err: err});
        return res.json(data);
    });
}

/**
 * return event type by id
 * @param req  http request
 * @param res  http response
 * @param callback
 */
function getItem(req, res, callback) {
    logger.info(' eventtype id=' + req.params.id);
    eventTypeService.getItemByID(req.params.id,function (err, datas) {
        if (err)
            return res.json({err: err});
        res.json(datas);
    });
}

exports.getItems = getItems;
exports.getItem = getItem;