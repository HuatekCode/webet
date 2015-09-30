"use strict"

/**
 * Created by benjamin on 2015/9/21.
 * Schedule model
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    type:{type:String},
    timer:{type:String},
    desc:{type:String},
    available:{type:Boolean}
},{versionKey:false});

mongoose.model('Schedule', schema, 'Schedules');
