"use strict"

/**
 * Created by benjamin on 2015/9/22.
 */
angular
    .module('bet.schedule')
    .config(scheduleConfig);

scheduleConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

function scheduleConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state("schedule", {
        url: "/schedule",
        templateUrl: '/admin/schedule/schedule.html',
        controller: 'scheduleAppCtrl'
    });
    $urlRouterProvider.otherwise("/schedule");
}
