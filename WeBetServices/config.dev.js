/**
 * Created by rock_zhu on 2015/3/11.
 */
module.exports = {
    cookieSecret:'betCookie',
    connectionstring:'mongodb://192.168.135.21:27017/contactlist',
    APP_KEY:'LyRdJ8nhDe8dGpD1',
    POST_URL:'https://api.betfair.com/exchange/betting/json-rpc/v1',
    LOGIN_URL:'https://identitysso.betfair.com/api/certlogin',
    KEY_FILE:'./authentication/client-2048.key',
    CRT_FILE:'./authentication/client-2048.crt',
    defaultSchedule:6,
    perPage:20,
    logConfigure:__dirname+"/log4js.json"
};