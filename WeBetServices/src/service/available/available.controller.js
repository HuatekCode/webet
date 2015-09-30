"use strict"

/**
 * Created by andre_zhang on 9/24-3/2015.
 * deal with available business logic
 */
var availableService = require('./available.services');
var logger = require('../../../logger').helper;

/**
 * get available data by filter
 * @param filter
 * @param page
 * @param per_page
 * @param callback
 */
var getItemsByFilter = function (filter, page, per_page, callback) {
    availableService.getItemsByFilter(filter, page, per_page, callback);
};
exports.getItemsByFilter = getItemsByFilter;

/**
 * save available
 * @param req  http request
 * @param res  http response
 * @param callback
 */
var availableSave = function (req, res, callback) {
    availableService.availableSave(req, res, callback);
};
exports.availableSave = availableSave;