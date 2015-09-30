"use strict";
/**
 * Created by andre_zhang on 2015/9/26.
 * home controller
 */
angular.module('bet.home')
    .controller('homeCtrl', homeCtrl);

//inject
homeCtrl.$inject = ['$scope', '$http', 'homeService'];

/**
 * homeCtrl methods
 * @param $scope
 * @param $http
 * @param homeService
 */
function homeCtrl($scope, $http, homeService) {
    //show competitions
    $scope.selectTypeCompetitions = {
        'total': 0,
        'items': []
    };
    //show events
    $scope.selectCompetitionEvents = {
        'total': 0,
        'items': []
    };
    //bellow use static data for example!
    $scope.eventTypes = [
        {id: '6423', name: 'American Football'},
        {id: '7511', name: 'Baseball'},
        {id: '7522', name: 'Basketball'},
        {id: '136332', name: 'Chess'},
        {id: '4', name: 'Cricket'},
        {id: '11', name: 'Cycling'},
        {id: '6231', name: 'Financial Bets'},
        {id: '3', name: 'Golf'},
        {id: '7', name: 'Horse Racing'}
    ];
    //show direct event types count
    $scope.eventTypeShowCount = 5;
    //show direct competitions count
    $scope.competitionShowCount = 5;
    // select event type
    $scope.selectEventTypeId = '';
    // select competition
    $scope.selectCompetitionId = '';
    // select event
    $scope.selectEventId = '';
    // input keyword
    $scope.selectEventKeyWord = '';
    // See All Events link status
    $scope.hasEventsMore = 'Y';

    /**
     * initial home page, show soccer type, competitions and so on.
     */
    var refresh = function () {
        homeService.getSoccerEventType(function (data) {
            if (data !== null && data.length > 0) {
                $scope.SoccerEventType = data[0];
                showCompetitions(data[0]['id']);
            } else {
                //soccer is not exist, set a default type
                $scope.SoccerEventType = $scope.eventTypes[0];
                $scope.eventTypes.shift();
            }
        }, function (err) {
            //alert('connect error!');
            bootbox.alert('connect error!');
        });

        //other types is disabled!
        //showEventTypes();
    };

    refresh();
    /**
     * show event type
     */
    var showEventTypes = function () {
        homeService.getOtherEventTypes(function (data) {
            if (data !== null && data.items != null) {
                $scope.eventTypes = data.items;
            } else {
                $scope.eventTypes = [];
            }
        }, function (err) {
            bootbox.alert('connect error!');
        });
    }

    /**
     * show competitions by event type
     * @param eventTypeId
     */
    var showCompetitions = function (eventTypeId) {
        homeService.getCompetitionsByEventTypeId(eventTypeId, function (data) {
            if (data !== null && data.items != null) {
                $scope.selectTypeCompetitions = data.items;
                if (data.items.length > 0) {
                    $scope.firstShowCompetition = data.items[0];
                    showEvents(data.items[0]['id']);
                } else {
                    $scope.firstShowCompetition = {};
                }
            } else {
                $scope.selectTypeCompetitions = [];
                $scope.firstShowCompetition = {};
            }
        }, function (err) {
            bootbox.alert('connect error!');
        });
    }

    /**
     * show events by competition
     * @param competitionId
     */
    var showEvents = function (competitionId) {
        $scope.selectCompetitionId = competitionId;
        homeService.getEventsByCompetitionId(competitionId, function (data) {
            if (data !== null) {
                $scope.selectCompetitionEvents = data;
                if (data.items.length < data.total) {
                    $scope.hasEventsMore = 'Y';
                } else {
                    $scope.hasEventsMore = 'N';
                }
            } else {
                $scope.selectCompetitionEvents = [];
                $scope.hasEventsMore = 'N';
                //alert('fetch Competitions failed!');
            }
        }, function (err) {
            bootbox.alert('connect error!');
        });
    }


    /**
     * competition select change method
     * @param competitionId
     */
    $scope.changeCompetition = function (competitionId) {
        showEvents(competitionId);
    }

    /**
     * events search method
     * @param e event
     */
    $scope.searchEvents = function (e) {
        enterKeyUp(e, function () {
            $scope.selectEventKeyWord = e.target.value;
            homeService.searchEventsByKeypword($scope.selectCompetitionId, e.target.value, function (data) {
                //$scope.searchEventResults = data;
                $scope.selectCompetitionEvents = data;
                if (response.items.length < response.total) {
                    $scope.hasEventsMore = 'Y';
                } else {
                    $scope.hasEventsMore = 'N';
                }
            }, function (err) {
                bootbox.alert('connect error!');
            })
        })
    }

    /**
     * show markets by event
     * @param eventId
     */
    var showMarkets = function (eventId) {
        $scope.selectEventId = eventId;
        homeService.getMarketsByEventId(eventId, function (data) {
            $scope.selectEventMarkets = data;
        }, function (err) {
            bootbox.alert('connect error!');
        })
    }


    /**
     * event change method
     * @param eventId
     */
    $scope.changeEvent = function (eventId) {
        showMarkets(eventId);
    }

    /**
     * enter key
     *
     * @param e
     * @param callback
     */
    var enterKeyUp = function (e, callback) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            callback(e);
        }
    }


    /**
     * search Markets by selected competition and keyword
     */
    $scope.showMoreEvents = function () {
        homeService.showMoreEventsByConditions($scope.selectCompetitionId, $scope.selectEventKeyWord, function (data) {
            //$scope.searchEventResults = data;
            $scope.selectCompetitionEvents = data;
            $scope.hasEventsMore = 'N';
        }, function (err) {
            bootbox.alert('connect error!');
        })
    }


    //$scope.$watch('$viewContentLoaded', function () {
    //    Metronic.init(); // init metronic core componets
    //});
}

