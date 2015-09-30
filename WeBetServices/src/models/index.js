"use strict"

/**
 * Created by benjamin on 2015/9/15.
 */

var mongoose = require('mongoose');
var config = require('../../config');
var fs = require('fs');
//var log = require('./../libs/log');

mongoose.connect(config.connectionstring);

var db = mongoose.connection;
console.log(config.connectionstring);

db.on('error', function (err) {
    console.error('connect to %s error: ', config.connectionstring, err.message);
    process.exit(1);
});
db.once('open', function () {
    //log.success('%s has been connected.', config.connectionstring);
});

//load models from all model file
var models_path = __dirname + '/mapping';
fs.readdirSync(models_path).forEach(function (file) {
    if (file.substr(file.length - 3, 3) === '.js') {
        //load model of model file
        require(models_path + '/' + file);
    }
});

//export all models to dao file
for (var modelName in mongoose.models) {
    exports[modelName] = mongoose.model(modelName);
}



