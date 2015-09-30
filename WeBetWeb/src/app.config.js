"use strict";
/**
 * Created by Administrator on 9/19/2015.
 * app config
 */

angular
    .module('betApp')
    .config(appConfig);

appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

/**
 *
 * ui-view config
 *
 * @param $stateProvider
 * @param $urlRouterProvider
 */
function appConfig($stateProvider, $urlRouterProvider) {
    //this method is used for extend
}