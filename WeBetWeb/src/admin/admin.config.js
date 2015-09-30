"use strict"

/**
 * Created by benjamin on 2015/9/19.
 */
angular
    .module('betAdminApp')
    .config(appConfig);

appConfig.$inject = ['$stateProvider', '$urlRouterProvider','RestangularProvider'];
function appConfig($stateProvider, $urlRouterProvider,RestangularProvider) {
    $urlRouterProvider.otherwise("/schedule");
}