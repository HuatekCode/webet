'use strict';
/**
 * created by jackie on 2015/9/19
 * competition request data router
 */


var competitionController = require('../../service/competition/competition.controller');
module.exports = function (app) {
    app.use('/competitions/:id', competitionController.getItem);
    app.use('/competitions', competitionController.getItems);
};

