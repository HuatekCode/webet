"use strict"
/**
 * Created by benjamin on 2015/9/22.
 */
var BetInit = {};
exports.BetInit = BetInit;
var config = require('../config'),
logger = require('../logger').helper;

/**
 *
 */
BetInit.initSchedule = function() {
    logger.info('begin: init schedule');
    var scheduleDao = require('./dao/scheduleDao'),
        scheduleService = require('./service/schedule/schedule.services').ScheduleService,
        timer = config.defaultSchedule || 6; // default 6 hours get once bet data

    var query = {type:'onTimer',available:true};
    scheduleDao.getByQuery(query, function (error, timerSchedules) {
        if (error) {
            logger.error('get onTimer error');
            return;
        }

        if (timerSchedules && timerSchedules.length > 0) {
            timer = timerSchedules[0].timer;
            // Create a new onTimer schedule, and not in the database storage
            scheduleService.onlyCreateSchedule('onTimer',timer,'system default',function(){
                logger.info('end: init schedule');
            });
        } else {
            // create new onTimer schedule by system default
            scheduleService.createSchedule('onTimer',timer,'system default',function(){
                logger.info('end: init schedule');
            });
        }
    });
};

BetInit.initAll = function() {
    logger.info('begin: init app');
    this.initSchedule();
    logger.info('end: init app');
}