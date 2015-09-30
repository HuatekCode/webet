"use strict"
/**
 * Created by benjamin on 2015/9/22.
 */

var scheduleService = require('./schedule.services').ScheduleService,
    logger = require('../../../logger').helper;

/**
 * get available onTimer and extra schedule for view
 * @param req  http request
 * @param res  http response
 * @param callback
 */
var getAvailableSchedule = function (req, res, callback) {
    scheduleService.getAvailableSchedule(function(err, schedules){
        if (err) {
            res.contentType('json');
            return res.status(500).send(JSON.stringify({ error:'can not load schedule'}));
        }
        res.contentType('json');
        res.status(200).send(JSON.stringify(schedules));
    });
}
exports.getAvailableSchedule = getAvailableSchedule;

/**
 * create a new schedule to get bet data
 * @param req  http request
 * @param res  http response
 * @param callback
 * @returns {*}
 */
var createSchedule = function(req, res, callback) {

    var type  = req.body.type || req.query.type,
        timer = req.body.timer || req.query.timer,
        desc  = req.body.desc || req.query.desc;

    if (!type || !timer) {
        return res.status(500).send(JSON.stringify({err:'Parameters must be provided'}));
    }
    if (type !== 'onTimer' && type !== 'extraTimer') {
        return res.status(500).send(JSON.stringify({err:'Parameter [type] does not comply with the contract'}));
    }

    var computerTimer = timer;
    if (type === 'extraTimer') {
        try {
            var msTimer = Date.parse(timer.replace(/-/g, "/"));
            var msNow = new Date().getTime();
            computerTimer = msTimer - msNow;
        } catch (err) {
            res.contentType('json');
            return res.status(500).send(JSON.stringify({ type:type, err:err }));
        }
    }
    if (computerTimer < 0) {
        //res.contentType('json');
        return res.status(500).send(JSON.stringify({ type:type, err:'Cannot be updated in the past time' }));
    }

    // delete old schedule and create new schedule must be async
    var async = require('async');
    async.waterfall([
        function(callback){
            scheduleService.getSchedule(type, callback);
        },
        function(result, callback){
            scheduleService.updateOldSchedule(type, result, callback);
        },
        function(result,callback){
            scheduleService.createSchedule(type, timer, desc, callback);
        }
    ],function(error,result) {
        if(error !== null){
            console.log('error: ' + error + ' ,' + result);
            logger.error('error: ' + error + ' ,' + result);
            res.contentType('json');
            res.status(500).send(JSON.stringify({ type:type,err:error }));
        }else{
            res.contentType('json');
            res.status(200).send(JSON.stringify({ type:type,timer:timer,desc:desc }));
        }
    });
};
exports.createSchedule = createSchedule;

/**
 * Immediately call update bet method
 * @param req
 * @param res
 * @param callback
 */
var updateNowSchedule = function (req, res, callback) {
    scheduleService.updateNowSchedule(callback);
    res.status(200).send(JSON.stringify({success: 'ok'}));
}
exports.updateNowSchedule = updateNowSchedule;
/**
 * cancel current schedule
 * @param req  http request
 * @param res  http response
 * @param callback
 * @returns {*}
 */
var cancelSchedule = function(req, res, callback) {

    var type = req.query.type;

    if (type !== 'cancelOnTime' && type !== 'cancelExtra') {
        res.contentType('json');
        return res.status(404).send('request path is not found');
    }

    scheduleService.cancelSchedule(type,function(err) {
        if (err) {
            res.contentType('json');
            res.status(500).send(JSON.stringify({ type:type,err:err}));
            return;
        }
        res.status(200).send(JSON.stringify({ type:type}));
    });
};
exports.cancelSchedule = cancelSchedule;