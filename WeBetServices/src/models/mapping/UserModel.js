"use strict";

/**
 * Created by andre_zhang on 2015/9/19.
 * User model
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name:{type:String},
    pwd:{type: String}
},{versionKey:false});


mongoose.model('User', schema, 'Users');