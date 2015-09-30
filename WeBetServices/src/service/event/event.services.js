"use strict";
/**
 * Created by andre_zhang on 9/19/2015.
 * event service
 */
var eventDao = require("../../dao/EventDao");
var Paginate = require("../../dao/Paginate");
var availableDao = require("../../dao/AvailableDao");
var logger = require('../../../logger').helper;

/**
 * return available events
 * @param filter
 * @param page
 * @param per_page
 * @param callback
 */
var getAvailableItemsByFilter = function (filter, page, per_page, callback) {
    availableDao.distinctFiled('eventId', function(err, data){
        if(err)
            callback(err,callback);
        filter['id'] = {'$in' : data};
        getItemsByFilter(filter, page, per_page, callback);
    })
};
exports.getAvailableItemsByFilter = getAvailableItemsByFilter;

/**
 * return events
 * @param filter
 * @param page
 * @param per_page
 * @param callback
 */
var getItemsByFilter = function (filter, page, per_page, callback) {
    if (page === null || typeof page === 'undefined' || per_page === null || typeof per_page === 'undefined') {
        eventDao.getByQuery(filter, function (err, events) {
            callback(err, events);
        });
    } else {
        var paginate = new Paginate(page, per_page);
        eventDao.findPagination(filter, paginate, 'name', function (err, paginate) {
            callback(err, paginate);
        });
    }
};
exports.getItemsByFilter = getItemsByFilter;

/**
 * return event by Id
 * @param eventId
 * @param callback
 */
var getItemByID = function (eventId, callback) {
    eventDao.getByQuery({'id': eventId}, function (err, event) {
        callback(err, event);
    });
};
exports.getItemByID = getItemByID;
