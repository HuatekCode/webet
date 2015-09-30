"use strict";

/**
 * Created by andre_zhang on 2015/9/19.
 * MarketPrice and OriginMarketPrice model
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    //_id:{ type:Schema.ObjectId  },
    marketId: {type:String},
    isMarketDataDelayed: {type:String},
    status: {type:String},
    betDelay: {type:String},
    bspReconciled: {type:Boolean},
    complete: {type:Boolean},
    inplay: {type:Boolean},
    numberOfWinners: {type:String},
    numberOfRunners: {type:String},
    numberOfActiveRunners: {type:String},
    totalMatched: {type:String},
    totalAvailable: {type:String},
    crossMatching: {type:Boolean},
    runnersVoidable: {type:Boolean},
    version: {type:String},
    runners: [{
        selectionId: {type:String},
        handicap: {type:String},
        status: {type:String},
        totalMatched:{type:String},
        ex: {
            availableToBack: [{
                price: {type:String},
                size: {type:String}
            }],
            availableToLay: [{
                price: {type:String},
                size: {type:String}
            }],
            tradedVolume: [{
                price: {type:String},
                size: {type:String}
            }]
        }
    }]
},{versionKey:false});

mongoose.model('MarketPrice', schema, 'MarketPrices');
mongoose.model('OriginMarketPrice', schema, 'OriginMarketPrices');