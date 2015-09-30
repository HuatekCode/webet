"use strict"

/**
 * Created by andre_zhang on 2015/9/26.
 * defined setting service
 */
angular.module('setting')
    .factory('settingService', settingService);

settingService.$inject = ['httpUtils'];
function settingService(httpUtils) {
    return {
        loadData: function (successCallBack, errCallBack) {
            httpUtils.setUrl('/admin/setting/eventTypeTree')
                .setSendData({})
                .get(successCallBack, errCallBack);
        },
        updateData: function (childrens, successCallBack, errCallBack) {
            httpUtils.setUrl('/availableSave')
                .setSendData({available: childrens})
                .post(successCallBack, errCallBack);
        }
    };
}