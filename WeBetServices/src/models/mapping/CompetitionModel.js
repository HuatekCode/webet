"use strict";

/**
 * Created by benjamin on 2015/9/19.
 * Competition model
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    //_id:{ type:Schema.ObjectId  },
    id:{ type:String },
    name:{type:String},
    eventTypeId:{type:String}
},{versionKey:false});

mongoose.model('Competition', schema, 'Competitions');
mongoose.model('OriginCompetition', schema, 'OriginCompetitions');
