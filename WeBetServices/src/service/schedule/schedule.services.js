"use strict"

/**
 * Created by benjamin on 2015/9/22.
 */
var hashmap = require('../../toolkit/hashmap'),
    later = require('later'),
    scheduleDao = require('./../../dao/scheduleDao'),
    logger = require('../../../logger').helper,
    updateBet = require('../../update/updatedata/index.js');

/**
 * the module global map.
 */
var scheduleMap = new hashmap.HashMap();

var ScheduleService = {};
exports.ScheduleService = ScheduleService;

/**
 * get available onTimer and extra schedule
 * @param req
 * @param res
 * @param callback
 */
ScheduleService.getAvailableSchedule = function (callback) {
    var query = {available:true};
    scheduleDao.getByQuery(query, function (error, timerSchedules) {
        callback(error,timerSchedules);
    });
};

/**
 * get old schedule for invalid it
 * @param query the mongodb query
 * @param callback
 */
ScheduleService.getSchedule = function (type, callback){
    var query = {type:type,available:true};
    scheduleDao.getByQuery(query, function (error, timerSchedule) {
        callback(error,timerSchedule);
    })
};

/**
 * update old schedule
 *  available: true --> false
 * @param type the schedule type: onTimer or extraTimer
 * @param callback
 * @returns {*}
 */
ScheduleService.updateOldSchedule = function(type, timerSchedule, callback) {
    logger.info('begin: close old schedule by type: ' + type);
    if(timerSchedule) {
        var conditions = {type:type,available:true};
        var update = {available:false};
        scheduleDao.update(conditions, update, {multi:true}, function(error,timerSchedules){
            callback(error, timerSchedules);
        });
    } else {
        callback(null, timerSchedule);
    }
    logger.info('end: close old onTimer schedule');
};

/**
 * create a new schedule and backup it into database
 * @param type schedule type: onTimer or extraTimer
 * @param time hours or datatimer
 * @param desc the describe for schedule
 * @param callback error callback or sucess callback
 */
ScheduleService.createSchedule = function (type, time, desc, callback) {
    var updateBet = require('../../update/updatedata/index.js');
    scheduleDao.create({type: type,timer:time,desc:desc,available:true}, function (error) {
        logger.info('begin: create new schedule');

        if (error) {
            logger.error('create Schedule error :' + error);
            return  callback(error);
        }

        var onTimeSchedule = scheduleMap.get(type);
        if (onTimeSchedule) {
            onTimeSchedule.clear();
            scheduleMap.remove(type);
        }

        later.date.localTime();
        if (type === 'onTimer') {
            // create onTimere schedule for executing it
            var schedule = later.parse.recur().every(parseInt(time)).hour(),
                t = later.setInterval(function () {
                    logger.info('begin: update bet data by onTimer schedule');
                    updateBet.UpdateData();
                    logger.info('end: update bet data by onTimer schedule');
                }, schedule);
        } else {
            var msTimer = Date.parse(time.replace(/-/g, "/"));
            var msNow = new Date().getTime();
            var computerTimer = msTimer - msNow;
            // create once schedule for executing it after [timer] seconds
            var schedule = later.parse.recur().every(computerTimer).second(),
                t = later.setTimeout(function () {
                    logger.info('begin: update bet data by extraTimer schedule');
                    updateBet.UpdateData();
                    logger.info('end: update bet data by extraTimer schedule');
                }, schedule);
        }
        scheduleMap.set(type, t);

        logger.info('end: create new schedule');
        callback(null,null);
    });
};

/**
 * create a new schedule without record it
 * @param type schedule type: onTimer or extraTimer
 * @param time if type is 'onTimer' this time is hours; if type is 'extraTimer' this time must be the seconds from 1/1/1970 00:00:00
 * @param desc the describe for schedule
 * @param callback error callback or sucess callback
 */
ScheduleService.onlyCreateSchedule = function (type, time, desc, callback) {
    var updateBet = require('../../update/updatedata/index.js');
        logger.info('begin: generate new schedule');

        var onTimeSchedule = scheduleMap.get(type);
        if (onTimeSchedule) {
            onTimeSchedule.clear();
            scheduleMap.remove(type);
        }

        later.date.localTime();
        if (type === 'onTimer') {
            // create onTimere schedule for executing it
            var schedule = later.parse.recur().every(parseInt(time)).hour(),
                t = later.setInterval(function () {
                    logger.info('begin: update bet data by onTimer schedule');
                    updateBet.UpdateData();
                    logger.info('end: update bet data by onTimer schedule');
                }, schedule);
            scheduleMap.set(type, t);
        } else if (type === 'extraTimer') {
            // create once schedule for executing it after [timer] seconds
            var schedule = later.parse.recur().every(time).second(),
                t = later.setTimeout(function () {
                    logger.info('begin: update bet data by extraTimer schedule');
                    updateBet.UpdateData();
                    logger.info('end: update bet data by extraTimer schedule');
                }, schedule);
            scheduleMap.set(type, t);
        } else {
                logger.error('create Schedule error : type is not definded :' + type);
                return  callback('create Schedule error : type is not definded :' + type);
        }
        logger.info('end: generate new schedule');
        callback();
};

/**
 * Immediately call update bet method
 * @param callback
 */
ScheduleService.updateNowSchedule = function(callback) {
    logger.info('begin: update bet data now');
    updateBet.UpdateData();
    logger.info('end: update bet data now');
};

/**
 * cancel the schedule witch schedule will bo running
 * @param type
 * @param callback
 */
ScheduleService.cancelSchedule = function(type, callback) {
    var scheduleType = type === 'cancelOnTime' ? 'onTimer' : 'extraTimer',
        conditions = {type:scheduleType,available:true},
        update = {available:false};

    scheduleDao.update(conditions, update, {multi:true}, function(error,timerSchedules){
        if (scheduleMap.get(scheduleType)) {
            scheduleMap.get(scheduleType).clear();
            scheduleMap.remove(scheduleType);
        }
        callback(error, timerSchedules);
    });
};