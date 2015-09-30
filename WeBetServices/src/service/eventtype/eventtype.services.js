"use strict";
/**
 * Created by andre_zhang on 9/19/2015.
 * event type service
 */
var eventTypeDao = require("../../dao/EventTypeDao");
var Paginate = require("../../dao/Paginate");
var availableDao = require("../../dao/AvailableDao");
var logger = require('../../../logger').helper;

/**
 * return available event types
 * @param filter
 * @param page
 * @param per_page
 * @param callback
 */
var getAvailableItemsByFilter = function (filter, page, per_page, callback) {
    availableDao.distinctFiled('eventTypeId', function(err, data){
        if(err)
            callback(err,callback);
        filter['id'] = {'$in' : data};
        getItemsByFilter(filter, page, per_page, callback);
    })
};
exports.getAvailableItemsByFilter = getAvailableItemsByFilter;


/**
 * return event types
 * @param filter
 * @param page
 * @param per_page
 * @param callback
 */
var getItemsByFilter = function (filter, page, per_page, callback) {
    if (page === null || typeof page === 'undefined' || per_page === null || typeof per_page === 'undefined') {
        eventTypeDao.getByQuery(filter, function (err, eventtypes) {
            callback(err, eventtypes);
        });
    } else {
        var paginate = new Paginate(page, per_page);
        eventTypeDao.findPagination(filter, paginate, 'name', function (err, paginate) {
            callback(err, paginate);
        });
    }
};
exports.getItemsByFilter = getItemsByFilter;

/**
 * return event type by id
 * @param eventTypeId
 * @param callback
 */
var getItemByID = function (eventTypeId, callback) {
    eventTypeDao.getByQuery({'id': eventTypeId}, function (err, eventType) {
        callback(err, eventType)
    });
};
exports.getItemByID = getItemByID;