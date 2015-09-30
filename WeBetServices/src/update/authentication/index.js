'use strict';
/**
 * created by jackie on 2015/9/21
 * provide extenal call API for User Login interface
 */

/**
 * login for get session token
 * @param parentCallback
 * @returns {boolean}
 */
exports.getSessionToken = function (parentCallback) {
    var login = require('./login.js').loginHandler,
        config = require('../../../config.js'),
        loggerHandler = require('../../../logger.js').helper,
        async = require('async');
    //app key
    if (config.APP_KEY === '') {
        loggerHandler.info('getSessionToken: app key is empty');
        return false;
    }
    //login url
    if (config.LOGIN_URL === '') {
        loggerHandler.info('getSessionToken: login url is empty');
        return false;
    }
    var fs = require('fs');
    //key file
    if (!fs.existsSync(config.KEY_FILE)) {
        loggerHandler.info('getSessionToken: key file not exists');
        return false;
    }
    //cert file
    if (!fs.existsSync(config.CRT_FILE)) {
        loggerHandler.info('getSessionToken: cert file not exists');
        return false;
    }

    var userDao = require("../../dao/UserDao");
    async.waterfall([
            function (callback) {
                userDao.getByQuery({}, function (err, users) {
                    if (users.length > 0) {
                        callback(err, users);
                    }
                    else {
                        callback('user name and passwrod can not get', null);
                    }
                });
            },
            function (result, callback) {
                login.setAppKey(config.APP_KEY)
                    .setCallUrl(config.LOGIN_URL)
                    .setKeyFile(config.KEY_FILE)
                    .setCrtFile(config.CRT_FILE)
                    .setUserName(result[0].name)
                    .setPassword(result[0].pwd)
                    .loginForSessionToken(callback);
            }
        ],
        function (error, result) {
            if (error !== null && error !== undefined) {
                loggerHandler.error(error);
            }
            parentCallback(error, result);
        });
};