'use strict';

/**
 * created by jackie on 2015/9/17
 * User Login interface
 */
var loginHandler = {};
exports.loginHandler = loginHandler;

var _appkey = '',//application key
    _loginInfo = {//user,password for login
        username: '',
        password: ''
    },
    _loginUrl = '',//login url
    _keyFile = '',//key file of crt file
    _crtFile = '';//crt file

var logger = require('../../../logger').helper;

/**
 * get session for callback function
 * @param callback
 */
loginHandler.loginForSessionToken = function (callback) {
    var isOK = checkParameters();

    if (isOK) {
        var https = require('https'),
            qs = require('querystring');

        var post_option = createPostOption();

        var post_req = https.request(post_option, function (res) {
            try {
                var buffer = '';
                res.on('data', function (chunk) {
                    buffer += chunk;
                });
                res.on('end', function () {
                    try {
                        var resultVal = JSON.parse(buffer.toString());
                        if (resultVal.loginStatus === 'SUCCESS') {
                            if (callback) {
                                callback(null, resultVal.sessionToken);
                            }
                        } else {
                            logger.error('login faild: return message=' + buffer.toString());
                            callback('login faild', buffer.toString());
                        }
                    } catch (e) {
                        logger.error('invaild post return data: error=' + e + ', data' + buffer.toString());
                        callback('login error: ' + e, buffer.toString());
                    }
                });
            } catch (e) {
                logger.error('unexpect exception=' + e);
                callback(e.message, null);
            }
        });
        post_req.on('error', function (e) {
            logger.error('post request exception:' + e);
        });
        //write login info to request login
        post_req.write(qs.stringify(_loginInfo));
        post_req.end();
    }
    else {
        callback('error: parameter is invaild', null);
    }
};

/**
 * build post option
 */
function createPostOption() {
    var url = require('url'),
        fs = require('fs'),
        https=require('https'),
        header = {
            'X-Application': _appkey,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        post_option = url.parse(_loginUrl);


    post_option.method = 'POST';
    post_option.port = 443;
    post_option.headers = header;
    post_option.key = fs.readFileSync(_keyFile);
    post_option.cert = fs.readFileSync(_crtFile);
    post_option.agent = new https.Agent(post_option);
    return post_option;
}

/**
 * check post paramters valid
 * @returns {boolean}
 */
function checkParameters() {
    if (_appkey === ''
        || _loginInfo.username === ''
        || _loginInfo.password === ''
        || _loginUrl === ''
        || _keyFile === ''
        || _crtFile === '') {
        return false;
    }
    return true;
}

/**
 * set application key
 * @param appKey
 * @returns {loginHandler}
 */
loginHandler.setAppKey = function (appKey) {
    _appkey = appKey;
    return this;
};

/**
 * set login user name
 * @param uid
 * @returns {loginHandler}
 */
loginHandler.setUserName = function (uid) {
    _loginInfo.username = uid;
    return this;
};

/**
 * set login password
 * @param pwd
 * @returns {loginHandler}
 */
loginHandler.setPassword = function (pwd) {
    _loginInfo.password = pwd;
    return this;
};

/**
 * set login url
 * @param url
 * @returns {loginHandler}
 */
loginHandler.setCallUrl = function (url) {
    _loginUrl = url;
    return this;
};

/**
 * set key file
 * @param keyFile
 * @returns {loginHandler}
 */
loginHandler.setKeyFile = function (keyFile) {
    _keyFile = keyFile;
    return this;
};

/**
 * set crt file
 * @param crtFile
 * @returns {loginHandler}
 */
loginHandler.setCrtFile = function (crtFile) {
    _crtFile = crtFile;
    return this;
};
