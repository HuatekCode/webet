'use strict';
/**
 * created by jackie on 2015/9/22
 * provide API for request data from web site
 */
var apiHandler = {};
exports.apiHandler = apiHandler;

var _appKey = '',
    _sessionToken = '',
    _postUrl = '';

/**
 * call api for data
 * @param jsonRpc
 * @param dataFunc
 * @param errFunc
 * @param extendData
 */
function callAping(jsonRpc, dataFunc, errFunc, extendData) {
    var header = {
            'X-Application': _appKey,
            'X-Authentication': _sessionToken,
            'content-type': 'application/json',
            'Content-Length': jsonRpc.length
        },
        https = require('https'),
        url = require('url'),
        post_option = url.parse(_postUrl);
    post_option.method = 'POST';
    post_option.port = 443;
    post_option.headers = header;
    //console.log(jsonRpc);
    var post_req = https.request(post_option, function (res) {
        var dataStr = '';
        res.on('data', function (chunk) {
            dataStr += chunk;
        });
        res.on('end', function () {
            if (dataFunc !== null) {
                dataFunc(dataStr, extendData);
            }
        });

        res.on('error', function (e) {
            if (errFunc !== null) {
                errFunc(e);
            }
        });
    });
    post_req.write(jsonRpc);
    post_req.end();
    post_req.on('error', function (e) {
        console.error(e);
    });
}

/**
 * set default params
 * @param method
 * @param params
 * @param dataFunc
 * @param errFunc
 * @param extendData
 * @returns {*}
 */
function commonCall(method, params, dataFunc, errFunc, extendData) {
    var jsonRpc = {
        jsonrpc: '2.0',
        method: 'SportsAPING/v1.0/' + method,
        params: params,
        id: 1
    };
    var competitions = callAping(JSON.stringify(jsonRpc), dataFunc, errFunc, extendData);
    return competitions;
}

/**
 * event type api
 * @param params
 * @param dataFunc
 * @param errFunc
 */
apiHandler.processEventTypes = function (params, dataFunc, errFunc) {
    var method = 'listEventTypes';
    commonCall(method, params, dataFunc, errFunc);
};

/**
 * competition api
 * @param params
 * @param dataFunc
 * @param errFunc
 * @param extendData
 */
apiHandler.processCompetitions = function (params, dataFunc, errFunc, extendData) {
    var method = 'listCompetitions';
    commonCall(method, params, dataFunc, errFunc, extendData);
};

/**
 * event api
 * @param params
 * @param dataFunc
 * @param errFunc
 * @param extendData
 */
apiHandler.processEvents = function (params, dataFunc, errFunc, extendData) {
    var method = 'listEvents';
    commonCall(method, params, dataFunc, errFunc, extendData);
};

/**
 * market api
 * @param params
 * @param dataFunc
 * @param errFunc
 * @param extendData
 */
apiHandler.processMarkets = function (params, dataFunc, errFunc, extendData) {
    var method = 'listMarketCatalogue';
    commonCall(method, params, dataFunc, errFunc, extendData);
};

/**
 * market prics api
 * @param params
 * @param dataFunc
 * @param errFunc
 * @param extendData
 */
apiHandler.processMarketBooks = function (params, dataFunc, errFunc, extendData) {
    var method = 'listMarketBook';
    commonCall(method, params, dataFunc, errFunc, extendData);
};

/**
 * set application key
 * @param appKey
 * @returns {apiHandler}
 */
apiHandler.setAppKey = function (appKey) {
    _appKey = appKey;
    return this;
};

/**
 * set session token
 * @param tk
 * @returns {apiHandler}
 */
apiHandler.setSessionToken = function (tk) {
    _sessionToken = tk;
    return this;
};

/**
 * set post url
 * @param url
 * @returns {apiHandler}
 */
apiHandler.setPostUrl = function (url) {
    _postUrl = url;
    return this;
};

