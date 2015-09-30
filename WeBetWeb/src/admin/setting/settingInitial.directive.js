"use strict"

/**
 * Created by andre_zhang on 2015/9/27.
 * user defined initial treegrid directive
 */
angular.module('setting')
    .directive('initial', initial);

function initial() {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            InitialGridSize();

            $(window).on('resize', function () {
                InitialGridSize();
            });
        }
    }
}

function InitialGridSize() {
    var clientWidth = $("div.page-bar")[0].clientWidth;
    $(".directive").css("width", clientWidth - 40);
}