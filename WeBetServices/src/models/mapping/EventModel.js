"use strict";

/**
 * Created by andre_zhang on 2015/9/19.
 * Event model
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    //_id:{ type:Schema.ObjectId  },
    id:{ type:String },
    name:{type:String},
    countryCode:{type: String},
    timezone:{type:String},
    openDate:{type:String},
    eventTypeId:{type:String},
    competitionId:{type:String}
},{versionKey:false});

mongoose.model('Event', schema, 'Events');
mongoose.model('OriginEvent', schema, 'OriginEvents');