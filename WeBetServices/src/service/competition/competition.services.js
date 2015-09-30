"use strict";
/**
 * Created by andre_zhang on 9/19/2015.
 * competition service
 */
var competitionDao = require('./../../dao/CompetitionDao');
var Paginate = require("../../dao/Paginate");
var availableDao = require("../../dao/AvailableDao");
var logger = require('../../../logger').helper;

/**
 * return available competitions
 * @param filter
 * @param page
 * @param per_page
 * @param callback
 */
var getAvailableItemsByFilter = function (filter, page, per_page, callback) {
    availableDao.distinctFiled('competitionId', function(err, data){
        if(err)
            callback(err,callback);
        filter['id'] = {'$in' : data};
        getItemsByFilter(filter, page, per_page, callback);
    })
};
exports.getAvailableItemsByFilter = getAvailableItemsByFilter;

/**
 *  return competitions
 * @param filter
 * @param page
 * @param per_page
 * @param callback
 */
var getItemsByFilter = function (filter, page, per_page, callback) {
    if (page === null || typeof page === 'undefined' || per_page === null || typeof per_page === 'undefined') {
        competitionDao.getByQuery(filter, function (err, competitions) {
            callback(err, competitions);
        });
    } else {
        var paginate = new Paginate(page, per_page);
        competitionDao.findPagination(filter, paginate, 'name', function (err, paginate) {
            callback(err, paginate);
        });
    }
};
exports.getItemsByFilter = getItemsByFilter;

/**
 *
 * return competition by competition id
 *
 * @param competitionId
 * @param callback
 */
var getItemByID = function (competitionId, callback) {
    competitionDao.getByQuery({'id': competitionId}, function (err, competition) {
        callback(err, competition);
    });
};
exports.getItemByID = getItemByID;
