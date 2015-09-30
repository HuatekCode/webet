'use strict';
/**
 * created by jackie on 2015/9/22
 * routers register
 */

module.exports.attachRouters = function (app) {
    //root router
    require('./default.js')(app);
    //other logiic router
    require('./eventtype/index.js')(app);
    require('./competition/index.js')(app);
    require('./event/index.js')(app);
    require('./market/index.js')(app);
    require('./marketprice/index.js')(app);
    require('./setting/index.js')(app);
    require('./schedule/index.js')(app);
    require('./setting/index.js')(app);
    require('./available/index.js')(app);
};