"use strict"

/**
 * Created by andre_zhang on 2015/9/19.
 */
angular.module('setting').config(scheduleConfig);
scheduleConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

function scheduleConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state("setting", {
        url: "/setting",
        templateUrl: '/admin/setting/setting.html',
        controller: 'settingAppCtrl'
    });
    $urlRouterProvider.otherwise("/setting");
}