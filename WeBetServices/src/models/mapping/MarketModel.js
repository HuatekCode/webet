"use strict";

/**
 * Created by andre_zhang on 2015/9/19.
 * Market and OriginMarket model
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    //_id:{ type:Schema.ObjectId  },
    marketId:{ type:String },
    marketName:{type:String},
    marketStartTime:{type: String},
    totalMatched:{type:String},
    runners:[{
        selectionId : String,
        runnerName: String,
        handicap: String,
        sortPriority: String,
        metadata: {
            runnerId: String
        }
    }],
    eventTypeId:{type:String},
    competitionId:{type:String},
    eventId:{type:String}
},{versionKey:false});

mongoose.model('Market', schema, 'Markets');
mongoose.model('OriginMarket', schema, 'OriginMarkets');