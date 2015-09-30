"use strict";

/**
 * Created by andre_zhang on 2015/9/19.
 * EventType model
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    //_id:{ type:Schema.ObjectId  },
    id:{ type:String },
    name:{type:String}
},{versionKey:false});

mongoose.model('EventType', schema, 'EventTypes');
mongoose.model('OriginEventType', schema, 'OriginEventTypes');