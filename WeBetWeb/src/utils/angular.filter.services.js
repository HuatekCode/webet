/**
 * Created by andre_zhang on 2015/9/26.
 * angular filter
 */

/**
 * bet.filter define
 */
angular.module('bet.filter')
    .filter('startFrom', function () {
        return function (input, start) {
            if (input !== null && start > 0 && start <= input.length) {
                return input.slice(start);
            } else {
                return input;
            }
        }
    }
)
