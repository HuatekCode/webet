"use strict"

/**
 * Created by andre_zhang on 9/24/2015.
 * deal with event tree table business logic
 */
var eventtypeService = require('./../eventtype/eventtype.services');
var competitionService = require('./../competition/competition.services');
var eventService = require('./../event/event.services');
var marketService = require('./../market/market.services');
var availableService = require('./../available/available.services');
var marketpriceService = require('./../marketprice/marketprice.services');
var moment = require("../../toolkit/moment.min.js");

/**
 * build tree
 * @param req
 * @param res
 * @param callback
 */
var getEventTypeTrees = function (req, res, callback) {
    var eventTypes, competitions, events, markets, marketPrices, availables;
    var async = require('async');
    async.waterfall([
        function (callback) {
            //get eventtype data by filter
            eventtypeService.getItemsByFilter({name: 'Soccer'}, null, null, callback);
        },
        function (result, callback) {
            eventTypes = result;
            //get all competition data
            competitionService.getItemsByFilter({}, null, null, callback);
        },
        function (result, callback) {
            competitions = result;
            //get all event data
            eventService.getItemsByFilter({}, null, null, callback);
        },
        function (result, callback) {
            events = result;
            //get all market data
            marketService.getItemsByFilter({}, null, null, callback);
        },
        function (result, callback) {
            markets = result;
            //get all marketprice data
            marketpriceService.getItemsByFilter({}, null, null, callback);
        },
        function (result, callback) {
            marketPrices = result;
            //get all available data
            availableService.getItemsByFilter({}, null, null, callback);
        },
        function (result, callback) {
            var availables = result;
            var tree = createEventTypeTree(eventTypes, competitions, events, markets, marketPrices, availables);
            callback(null, tree);
        }
    ], function (error, result) {
        if (error !== null) {
            console.log('error: ' + error + ' ,' + result);
        } else {
            res.json(result);
        }
    });
};
exports.getEventTypeTrees = getEventTypeTrees;

/**
 * build eventtype tree
 * @param eventTypes
 * @param competitions
 * @param events
 * @param markets
 * @param marketPrices
 * @param availables
 * @returns {Array}
 */
function createEventTypeTree(eventTypes, competitions, events, markets, marketPrices, availables) {
    if (eventTypes === null || eventTypes.length === 0) {
        return tree;
    }
    var tree = [],
        treeObj = {};
    var childrens = [];
    var placeholder = '';
    for (var i = 0; i < eventTypes.length; i++) {
        if (eventTypes[i]['name'] !== "Soccer") {
            continue;
        }
        treeObj = {};
        treeObj['id'] = eventTypes[i]['id'];
        treeObj['text'] = eventTypes[i]['id'] + '_' + placeholder + '_' + placeholder + '_' + placeholder;
        treeObj['expanded'] = false;
        //treeObj['enabled'] = false;

        var checked = true;
        var style = {normal: 'grey'};

        //get eventype tree node checked status
        if (availables !== null) {
            for (var j = 0; j < availables.length; j++) {
                if (availables[j]['eventTypeId'] === eventTypes[i]['id']) {
                    checked = false;
                    style = {normal: ''};
                    break;
                }
            }
        }
        treeObj['cells'] = [
            {cid: 1, value: !checked},
            {cid: 2, text: eventTypes[i]['name'], style: style}
        ];
        tree.push(treeObj);
        childrens = createCompetitionRows(competitions, events, markets, marketPrices, availables, eventTypes[i]['id']);
        if (childrens !== null && childrens.length > 0)
            tree = tree.concat(childrens);
    }
    return tree;
}

/**
 * build competition tree
 * @param competitions
 * @param events
 * @param markets
 * @param marketPrices
 * @param availables
 * @param eventTypeId
 * @returns {Array}
 */
function createCompetitionRows(competitions, events, markets, marketPrices, availables, eventTypeId) {
    if (competitions === null || competitions.length === 0) {
        return null;
    }
    var rows = [],
        subObj = {};
    var childrens = [];
    var placeholder = '';
    for (var i = 0; i < competitions.length; i++) {
        if (competitions[i]['eventTypeId'] === eventTypeId) {
            subObj = {};
            subObj['id'] = competitions[i]['id'];
            subObj['pid'] = eventTypeId;
            subObj['text'] = eventTypeId + '_' + competitions[i]['id'] + '_' + placeholder + '_' + placeholder;
            subObj['expanded'] = false;

            var checked = true;
            var style = {normal: 'grey'};

            //get competition tree node checked status
            if (availables !== null) {
                for (var j = 0; j < availables.length; j++) {
                    if (availables[j]['competitionId'] === competitions[i]['id']) {
                        checked = false;
                        style = {normal: ''};
                        break;
                    }
                }
            }
            subObj['cells'] = [
                {cid: 1, value: !checked},
                {cid: 2, text: competitions[i]['name'], style: style}
            ];
            rows.push(subObj);

            childrens = createEventRows(events, markets, marketPrices, availables, eventTypeId, competitions[i]['id']);
            if (childrens !== null && childrens.length > 0)
                rows = rows.concat(childrens);
        }
    }
    return rows;
}

/**
 * build event tree
 * @param events
 * @param markets
 * @param marketPrices
 * @param availables
 * @param eventTypeId
 * @param competitionId
 * @returns {Array}
 */
function createEventRows(events, markets, marketPrices, availables, eventTypeId, competitionId) {
    if (events === null || events.length === 0) {
        return null;
    }
    var rows = [],
        subObj = {};
    var childrens = [];
    var placeholder = '';
    for (var i = 0; i < events.length; i++) {
        if (events[i]['competitionId'] === competitionId) {
            subObj = {};
            subObj['id'] = events[i]['id'];
            subObj['pid'] = competitionId;
            subObj['text'] = eventTypeId + '_' + competitionId + '_' + events[i]['id'] + '_' + placeholder;
            subObj['expanded'] = false;
            var checked = true;
            var style = {normal: 'grey'};

            //get event tree node checked status
            if (availables !== null) {
                for (var j = 0; j < availables.length; j++) {
                    if (availables[j]['eventId'] === events[i]['id']) {
                        checked = false;
                        style = {normal: ''};
                        break;
                    }
                }
            }

            var scheduleDate;
            if (events[i]['openDate'] !== '') {
                scheduleDate = new Date(events[i]['openDate']);
            }
            subObj['cells'] = [
                {cid: 1, value: !checked},
                {cid: 2, text: events[i]['name'], style: style},
                {cid: 3, text: moment(scheduleDate).format('DD/MM/YYYY HH:mm:ss'), style: style}
            ];
            rows.push(subObj);
            childrens = createMarketRows(markets, marketPrices, availables, events[i]['id'])
            if (childrens !== null && childrens.length > 0)
                rows = rows.concat(childrens);
        }
    }
    return rows;
}

/**
 * build market tree
 * @param markets
 * @param marketPrices
 * @param availables
 * @param eventId
 * @returns {Array}
 */
function createMarketRows(markets, marketPrices, availables, eventId) {
    if (markets === null || markets.length === 0) {
        return null;
    }
    var subRows = [],
        subObj = {};
    for (var i = 0; i < markets.length; i++) {
        if (markets[i]['eventId'] !== eventId) {
            continue;
        }
        subObj = {};
        subObj['id'] = markets[i]['marketId'];
        subObj['pid'] = eventId;
        subObj['text'] = markets[i]['eventTypeId'] + '_' + markets[i]['competitionId'] + '_' + markets[i]['eventId'] + '_' + markets[i]['marketId'];
        subObj['expanded'] = false;

        var checked = true;
        var style = {normal: 'grey'};

        //get market tree node checked status
        if (availables !== null) {
            for (var j = 0; j < availables.length; j++) {
                if (availables[j]['marketId'] === markets[i]['marketId']) {
                    checked = false;
                    style = {normal: ''};
                    break;
                }
            }
        }

        //get market tree node status
        var status;
        for (var k = 0; k < marketPrices.length; k++) {
            if (marketPrices[k]["marketId"] === markets[i]['marketId']) {
                status = marketPrices[k]["status"];
                break;
            }
        }
        var startTime;
        if (markets[i]['marketStartTime'] !== '') {
            startTime = new Date(markets[i]['marketStartTime']);
        }
        subObj['cells'] = [
            {cid: 1, value: !checked},
            {cid: 2, text: markets[i]['marketName'], style: style},
            {cid: 4, text: moment(startTime).format('DD/MM/YYYY HH:mm:ss'), style: style},
            {cid: 5, text: status, style: style}
        ];
        subRows.push(subObj);
    }
    return subRows;
}