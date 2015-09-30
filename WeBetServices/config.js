'use strict';
/**
 * Created by benjamin on 2015/3/11.
 * config info
 */
module.exports = {
    cookieSecret:'betCookie',
    connectionstring:'mongodb://localhost:27017/contactlist',
    APP_KEY:'LyRdJ8nhDe8dGpD1',
    POST_URL:'https://api.betfair.com/exchange/betting/json-rpc/v1',
    LOGIN_URL:'https://identitysso.betfair.com/api/certlogin',
    KEY_FILE:__dirname + '/client-2048.key',
    CRT_FILE:__dirname + '/client-2048.crt',
    defaultSchedule:6,
    perPage:20,
    logConfigure:__dirname + "/log4js.json"
};