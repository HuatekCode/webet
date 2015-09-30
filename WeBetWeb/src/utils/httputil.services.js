angular.module('bet.utils')
    .factory('httpUtils', httpUtils);

httpUtils.$inject = ['$http'];
function httpUtils($http) {
    var _data = {}, _urlBack = '';
    return {
        post: function (successCallBack, errCallBack) {
            var transFn = function (data) {
                    return $.param(data);
                },
                postCfg = {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
                    transformRequest: transFn
                };

            var urlPre = window.location.origin;
            //urlPre = 'http://localhost:3001';

            var postObj = $http.post(urlPre + _urlBack, _data, postCfg);
            if (successCallBack !== null && successCallBack !== undefined) {
                postObj.success(successCallBack);
            }
            if (errCallBack !== null && errCallBack !== undefined) {
                postObj.error(errCallBack);
            }
        },
        get: function (successCallBack, errCallBack) {
            var data = $.param(_data);
            var urlPre = window.location.origin;
            //urlPre = 'http://localhost:3001';
            //$http.get(window.location.origin + _urlBack + '?' + data)
            var getObj=$http.get(urlPre + _urlBack + '?' + data);
            if (successCallBack !== null && successCallBack !== undefined) {
                getObj.success(successCallBack);
            }
            if (errCallBack !== null && errCallBack !== undefined) {
                getObj.error(errCallBack);
            }
        },
        setSendData: function (postData) {
            _data = postData;
            return this;
        },
        setUrl: function (url) {
            _urlBack = url;
            return this;
        }
    };
}