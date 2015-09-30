'use strict';
/**
 * created by jackie on 2015/9/22
 * root router
 */

module.exports = function (app) {
    app.get('/',function(req,res){
        res.redirect('/index.html');
    });
    app.get('/admin',function(req,res){
        res.redirect('/admin/index.html');
    });
};