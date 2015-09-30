"use strict"

/**
 * Created by andre_zhang on 2015/9/27.
 * user defined loading directive
 */
angular.module('setting')
    .directive('loading', loading);

function loading() {
    return {
        restrict: 'E',
        transclude: true,
        template: '<div class="divModal"><div ng-show="loading" class="loading" ng-transclude></div></div>',
        link: function (scope, element, attr) {
            scope.$watch('loading', function (val) {
                if (val)
                    $(element).show();
                else
                    $(element).hide();
            });
        }
    }
}