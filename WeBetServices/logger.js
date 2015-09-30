'use strict';
/**
 * created by jackie on 2015/9/22
 * logger wrapper
 */

var helper = {};
exports.helper = helper;

var log4js = require('log4js');
var fs = require('fs');
var path = require('path');
var config = require('./config');
var objConfig = JSON.parse(fs.readFileSync(config.logConfigure, 'utf8'));

if (objConfig.appenders) {
    var baseDir = objConfig['customBaseDir'];
    var defaultAtt = objConfig['customDefaultAtt'];
    //get all log4js's appender
    for (var i = 0, j = objConfig.appenders.length; i < j; i++) {
        var item = objConfig.appenders[i];
        if (item['type'] == 'console')
            continue;

        if (defaultAtt != null) {
            for (var att in defaultAtt) {
                if (item[att] == null)
                    item[att] = defaultAtt[att];
            }
        }
        if (baseDir != null) {
            if (item['filename'] == null)
                item['filename'] = baseDir;
            else
                item['filename'] = baseDir + item['filename'];
        }
        var fileName = item['filename'];
        if (fileName == null)
            continue;
        var pattern = item['pattern'];
        if (pattern != null) {
            fileName += pattern;
        }
        var category = item['category'];
        if (!isAbsoluteDir(fileName))
            throw new Error('In log4js.json,' + category + ' is not absolute path :' + fileName);
        var dir = path.dirname(fileName);
        checkAndCreateDir(dir);
    }
}

log4js.configure(objConfig);

//default logger
var logTrace = log4js.getLogger('logTrace');
var logDebug = log4js.getLogger('logDebug');
var logInfo = log4js.getLogger('logInfo');
var logWarn = log4js.getLogger('logWarn');
var logErr = log4js.getLogger('logErr');
var logFatal = log4js.getLogger('logFatal');

//helper.initLogger = function (loggerName) {
//    logTrace = log4js.getLogger(loggerName);
//    logDebug = log4js.getLogger(loggerName);
//    logInfo = log4js.getLogger(loggerName);
//    logWarn = log4js.getLogger(loggerName);
//    logErr = log4js.getLogger(loggerName);
//    logFatal = log4js.getLogger(loggerName);
//    return this;
//};

helper.trace = function(msg,exp){
    if (msg == null)
        msg = '';
    if (exp != null)
        msg += '' + exp;
    console.log(msg);
    logTrace.trace(msg,exp);
};

helper.debug = function (msg) {
    if (msg == null)
        msg = '';
    console.log(msg);
    logDebug.debug(msg);
};

helper.info = function (msg) {
    if (msg == null)
        msg = '';
    console.info(msg);
    logInfo.info(msg);
};

helper.warn = function (msg) {
    if (msg == null)
        msg = '';
    console.warn(msg);
    logWarn.warn(msg);
};

helper.error = function (msg, exp) {
    if (msg == null)
        msg = '';
    if (exp != null)
        msg += '' + exp;
    console.error(msg);
    logErr.error(msg);
};

helper.fatal = function (msg, exp) {
    if (msg == null)
        msg = '';
    if (exp != null)
        msg += '' + exp;
    logFatal.fatal(msg,exp);
};

//with express
exports.use = function (app) {
    app.use(log4js.connectLogger(logInfo, {level: 'debug', format: ':method :url'}));
};


function checkAndCreateDir(dir) {
    if (!fs.existsSync(dir)) {
        buildDir(dir);
    }
}

//recursion directory build
function buildDir(dir) {
    var dirArray = dir.split('/');
    var tmpPath = dirArray[0];
    for (var i = 1; i < dirArray.length; i++) {
        tmpPath += '/' + dirArray[i];
        if (!fs.existsSync(tmpPath)) {
            fs.mkdirSync(tmpPath);
        }
    }
}

function isAbsoluteDir(path) {
    if (path == null)
        return false;
    var len = path.length;

    var isWindows = process.platform === 'win32';
    if (isWindows) {
        if (len <= 1)
            return false;
        return path[1] == ':';
    } else {
        if (len <= 0)
            return false;
        return path[0] == '/';
    }
}





























