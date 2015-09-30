"use strict"

/**
 * Created by benjamin on 2015/9/22.
 */
angular
    .module('bet.schedule')
    .controller('scheduleAppCtrl', scheduleAppCtrl);

scheduleAppCtrl.$inject = ['$scope', '$http', '$timeout', 'Restangular'];

/**
 * all schedule set
 * @param $scope
 * @param $http
 * @param $timeout
 * @param Restangular
 */
function scheduleAppCtrl($scope, $http, $timeout, Restangular) {
    var Schedule = Restangular.all('schedule');
    $scope.onTimeDesc = 'unset';
    $scope.onTimerText = 'unset';
    $scope.extraDesc = 'unset';
    $scope.extraScheduleTimer = 'unset';

    $scope.$watch('$viewContentLoaded', function () {
        $('.requiredType').hide();
        $('.requiredExtra').hide();

        /**
         * datetimepicker initial set
         */
        $('.scheduledatetime').datetimepicker({
            format: 'yyyy-MM-dd hh:mm:ss',
            todayBtn: true,
            keyboardNavigation: true,
            forceParse: true,
            autoclose: true
        }).on("hide", function () {
            $('.requiredExtra').hide();
            $scope.$apply(function () {
                $scope.extraTimer = $(".extraTimer").val();
            });
        });

        /**
         * scheduleType change event
         */
        $('.scheduleTypeSelect').change(function () {
            $('.requiredOnTimer').hide();
            $('.requiredType').hide();
            /* Act on the event */
            var chooseValue = $('.scheduleTypeSelect').val();
            if (chooseValue === 'onTimer') {
                $('.onTimerBox').show();
                $('.extraTimerBox').hide();
            } else if (chooseValue === 'extraTimer') {
                $('.onTimerBox').hide();
                $('.extraTimerBox').show();
            }
        });

        $('.hourSelect').change(function () {
            $('.requiredOnTimer').hide();
        });
        $('.saveSchedule').click(saveSchedule);
        $('.cancelOnTime').click(cancelOnTimer);
        $('.cancelExtra').click(cancelExtraTimer);
        $('.updateNow').click(updateNowTimer);

        Schedule.get('getAvailableSchedule').then(function (schedules) {
            for (var i = 0; i < schedules.length; i++) {
                if (schedules[i].type === 'onTimer' && schedules[i].available) {
                    $scope.onTimeDesc = schedules[i].desc;
                    $scope.onTimerText = schedules[i].timer;
                } else if (schedules[i].type === 'extraTimer' && schedules[i].available) {
                    $scope.extraDesc = schedules[i].desc;
                    $scope.extraScheduleTimer = schedules[i].timer;
                }
            }
        }, function errorCallback(err) {
            console.log("There was an error saving:" + JSON.stringify(err));
        });
    });

    /**
     * save schedule
     */
    function saveSchedule() {
        var isReturn = false;
        if (!$scope.scheduleType) {
            $('.requiredType').show();
            isReturn = true;
        } else if (!$scope.onTimer && $scope.scheduleType === 'onTimer') {
            $('.requiredOnTimer').show();
            isReturn = true;
        } else if (!$scope.extraTimer && $scope.scheduleType === 'extraTimer') {
            $('.requiredExtra').show();
            isReturn = true;
        }
        if (isReturn) {
            return;
        }
        var timer;
        if ($scope.scheduleType === 'onTimer') {
            timer = $scope.onTimer;
        }
        if ($scope.scheduleType === 'extraTimer') {
            timer = $scope.extraTimer;
        }

        var data = {
            type: $scope.scheduleType,
            timer: timer,
            desc: $scope.descTimer
        };
        Schedule.post('', data).then(function (response) {
            var str = JSON.stringify(response);
            var obj = jQuery.parseJSON(str);
            if ($scope.scheduleType === 'onTimer') {
                $scope.onTimeDesc = obj.desc;
                $scope.onTimerText = obj.timer;
            } else {
                $scope.extraDesc = obj.desc;
                $scope.extraScheduleTimer = obj.timer;
            }
        }, function errorCallback(err) {
            alert("error:" + JSON.stringify(err.data));
        });
    }

    /**
     * timing update
     */
    function updateNowTimer() {
        Schedule.get('updateNowSchedule').then(function (data) {
            alert('update now');
        }, function errorCallback(err) {
            alert("There was an error :" + JSON.stringify(err.data));
        });
    }

    /**
     * cancel
     * @param type
     */
    function cancelOnTimer(type) {
        if ($scope.onTimerText === 'unset') {
            return;
        }
        Schedule.get('cancelSchedule', {type: 'cancelOnTime'}).then(function (data) {
            $scope.onTimeDesc = 'unset';
            $scope.onTimerText = 'unset';
        }, function errorCallback(err) {
            alert("There was an error :" + JSON.stringify(err.data));
        });
    }

    function cancelExtraTimer(type) {
        if ($scope.extraScheduleTimer === 'unset') {
            return;
        }

        Schedule.get('cancelSchedule', {type: 'cancelExtra'}).then(function (data) {
            $scope.extraDesc = 'unset';
            $scope.extraScheduleTimer = 'unset';
        }, function errorCallback(err) {
            alert("There was an error :" + JSON.stringify(err.data));
        });
    }
}