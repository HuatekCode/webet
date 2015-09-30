'use strict';
/**
 * created by rock_zhu on 2015/3/11
 * express program entry
 */

var express = require('express'),
    path = require('path'),
    http = require('http'),
    bodyParser = require('body-parser'),
    betInit = require('./src/bet.init').BetInit,
    app = express();

//app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));//set post data size

app.use(express.static(path.join(__dirname, "src/web")));

//Cross-Origin Resource Sharing
//app.all('*', function (req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//    res.header("X-Powered-By", ' 3.2.1');
//    //res.header("Content-Type", "application/json;charset=utf-8");
//    next();
//});

//init routes
var route = require('./src/route/index');
route.attachRouters(app);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({'error': err.message});
    });
}

app.use(function (req, res, next) {
    var err = new Error('Request Path Not Found');
    err.status = 404;
    res.send({'error': err.message});
});

module.exports = app;

betInit.initAll();

app.set('port', process.env.PORT || 8080);
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
