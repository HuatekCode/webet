"use strict";
/**
 * Created by andre_zhang on 2015/9/26.
 * home service
 */

angular.module('bet.home')
    .factory('homeService', homeService);

//inject
homeService.$inject = ['httpUtils'];

/**
 * home service methods
 *
 * @param httpUtils
 * @returns {{
 *         getSoccerEventType: Function,
 *         getOtherEventTypes: Function,
 *         getCompetitionsByEventTypeId: Function,
 *         getEventsByCompetitionId: Function,
 *         searchEventsByKeypword: Function,
 *         getMarketsByEventId: Function,
 *         showMoreEventsByConditions: Function
 *         }}
 */
function homeService(httpUtils) {

    return {
        /**
         * get soccer type
         *
         * @param successCallBack
         * @param errCallBack
         */
        getSoccerEventType: function (successCallBack, errCallBack) {
            httpUtils.setUrl('/eventtypes')
                .setSendData({'name': 'Soccer'})
                .get(successCallBack, errCallBack);
        },
        /**
         * get other event types
         * @param successCallBack
         * @param errCallBack
         */
        getOtherEventTypes: function (successCallBack, errCallBack) {
            var data = {'name': 'Soccer', 'except': '1', 'page': '1', 'per_page': '20'};
            httpUtils.setUrl('/eventtypes').setSendData(data).get(successCallBack, errCallBack);
        },
        /**
         * get competitions
         * @param eventTypeId
         * @param successCallBack
         * @param errCallBack
         */
        getCompetitionsByEventTypeId: function (eventTypeId, successCallBack, errCallBack) {
            var data = {'pid': eventTypeId, 'page': '1', 'per_page': '20'};
            httpUtils.setUrl('/competitions').setSendData(data).get(successCallBack, errCallBack);
        },
        /**
         * get events
         * @param competitionId
         * @param successCallBack
         * @param errCallBack
         */
        getEventsByCompetitionId: function (competitionId, successCallBack, errCallBack) {
            //alert(competitionId);
            var data = {'pid': competitionId, 'page': '1', 'per_page': '20'};
            httpUtils.setUrl('/events').setSendData(data).get(successCallBack, errCallBack);
        },
        /**
         * search events
         * @param competitionId
         * @param keyword
         * @param successCallBack
         * @param errCallBack
         */
        searchEventsByKeypword: function (competitionId, keyword, successCallBack, errCallBack) {
            var data = {'pid': competitionId, 'keyword': keyword, 'page': '1', 'per_page': '20'};
            httpUtils.setUrl('/events').setSendData(data).get(successCallBack, errCallBack);
        },
        /**
         * get markets
         * @param eventId
         * @param successCallBack
         * @param errCallBack
         */
        getMarketsByEventId: function (eventId, successCallBack, errCallBack) {
            var data = {'pid': eventId};
            httpUtils.setUrl('/markets').setSendData(data).get(successCallBack, errCallBack);
        },
        /**
         * show more events
         * @param competitionId
         * @param keyword
         * @param successCallBack
         * @param errCallBack
         */
        showMoreEventsByConditions: function (competitionId, keyword, successCallBack, errCallBack) {
            var data = {'pid': competitionId, 'keyword': keyword, 'page': '1', 'per_page': '1000'};
            httpUtils.setUrl('/events').setSendData(data).get(successCallBack, errCallBack);
        }
    }
}
