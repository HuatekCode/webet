"use strict"

/**
 * Created by andre_zhang on 2015/9/26.
 * user defined submit directive
 */
angular.module('setting')
    .directive('divSubmit', divSubmit);

function divSubmit() {
    return {
        restrict: 'E',
        replace: true,
        template: '<input type="button" class="btn disabled submit" value="{{buttonTitle}}" disabled="disabled"/>',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                scope.SaveClick();
            });
            elem.css("margin-right", "15px");
        }
    }
}