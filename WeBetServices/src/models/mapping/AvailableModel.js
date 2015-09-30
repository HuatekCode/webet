"use strict";

/**
 * Created by andre_zhang on 2015/9/21.
 * available model
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    eventTypeId: {type: String},
    competitionId: {type: String},
    eventId: {type: String},
    marketId: {type: String}
}, {versionKey: false});

mongoose.model('Available', schema, 'Available');
