"use strict"

/**
 * Created by andre_zhang on 9/23/2015.
 * operation available data
 */
var availableDao = require('./../../dao/AvailableDao');
var Paginate = require("../../dao/Paginate");
var logger = require('../../../logger').helper;

/**
 * get all available data
 * @param callback
 */
var getAllAvailable = function (callback) {
    availableDao.getAll(callback);
};
exports.getAllAvailable = getAllAvailable;

/**
 * get available data by filter
 * @param filter
 * @param page
 * @param per_page
 * @param callback
 */
var getItemsByFilter = function (filter, page, per_page, callback) {
    if (page === null || typeof page === 'undefined' || per_page === null || typeof per_page === 'undefined') {
        availableDao.getByQuery(filter, function (err, availables) {
            logger.info('available services: events record count=' + availables.length + ', error=' + err);
            callback(err, availables);
        });
    } else {
        var paginate = new Paginate(page, per_page);
        availableDao.findPagination(filter, paginate, 'name', function (err, paginate) {
            logger.info('available services: pages=' + paginate.pages + ', total=' + paginate.total);
            callback(err, paginate);
        });
    }
};
exports.getItemsByFilter = getItemsByFilter;

/**
 * save available to db
 * @param req
 * @param res
 * @param next
 */
var availableSave = function availableSave(req, res, next) {
    try {
        var availables = req.body.available;
        var availableArray = getAvailableArray(availables);
        availableInsert(availableArray);
        res.send({data: 'Submit successfully.'});
    }
    catch (e) {
        res.send({data: 'Submit failed. error:' + e});
    }
};

/**
 * get available array
 * @param availables
 */
function getAvailableArray(availables) {
    var availableObj;
    var availableArray = [];
    var params;
    var array = availables.split(',');

    for (var i = 0; i < array.length - 1; i++) {
        params = [];
        params = array[i].split('_');
        if (params.length > 0) {
            availableObj = {};
            availableObj['eventTypeId'] = params[0];
            availableObj['competitionId'] = params.length > 1 ? params[1] : '';
            availableObj['eventId'] = params.length > 2 ? params[2] : '';
            availableObj['marketId'] = params.length > 3 ? params[3] : '';
        }
        availableArray.push(availableObj);
    }
    return availableArray;
}

/**
 * insert available to db
 * @param availableArray
 */
function availableInsert(availableArray) {
    availableDao.delete(function (result) {
        logger.info('available services: delete available' + result != null ? 'success' : 'error');
    });
    if (availableArray.length > 0) {
        availableDao.create(availableArray, function (error, availables) {
            logger.info('available services: insert available =' + availables.length + ', error=' + error);
        });
    }
}
exports.availableSave = availableSave;

/**
 * delete available from db
 * @param req
 * @param res
 * @param next
 */
var availableDelete = function (req, res, next) {
    logger.info('available services: type=' + req.query.type + ',id=' + req.query.id + ' delete');
    res.send({data: 'availableDelete'});
};
exports.availableDelete = availableDelete;