'use strict';
/**
 * created by jackie on 2015/9/24
 * provide API for data refreshing
 */

/**
 * call update dat (login,backup,update)api
 * @constructor
 */
exports.UpdateData = function () {
    var login = require('../authentication/index.js'),
        store = require('../storedata/index.js'),
        async=require('async');
    async.waterfall([
        function(callback){
            login.getSessionToken(callback);
        },
        function(result,callback){
            store.storeData(result);
            callback(null,result);
        }
    ],function(error,result){
        if(error!==null){
            console.log('error: '+error +' ,'+result);
        }
    });
};
