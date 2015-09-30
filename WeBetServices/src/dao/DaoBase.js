"use strict";

/**
 * Created andre_zhang on 2015/9/22.
 *
 * To change this template use File | Settings | File Templates.
 */
var Paginate = require('./../dao/Paginate');

function DaoBase (Model){
    this.model = Model;
}

/**
 * save doc
 * @param doc
 * @param callback
 */
DaoBase.prototype.create = function (doc,callback){
    this.model.create(doc, function (error) {
        if(error) return callback(error);
        return callback(null, doc);
    });
};

/**
 * get data by id
 * @param id
 * @param callback
 */
DaoBase.prototype.getById = function (id, callback) {
    this.model.findOne({_id:id}, function(error, model){
        if(error) return callback(error,null);
        return callback(null,model);
    });
};

/**
 * get data count with query
 * @param query
 * @param callback
 */
DaoBase.prototype.countByQuery = function (query, callback) {
        this.model.count(query, function(error, model){
            if(error) return callback(error,null);
            return callback(null,model);
        });
};

/**
 *  get data with query
 * @param query
 * @param fileds
 * @param opt
 * @param callback
 */
DaoBase.prototype.getByQuery = function (query,fileds,opt,callback) {
    this.model.find(query, fileds, opt, function(error,model){
        if(error) return callback(error,null);

        return callback(null,model);
    });
};

/**
 * get page data with conditions
 * @param conditions
 * @param paginate
 * @param sort
 * @param callback
 */
DaoBase.prototype.findPagination = function(conditions, paginate, sort, callback) {

    var pageNumber = paginate.page;
    var resultsPerPage = paginate.perPage;

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
    var model = this.model;
    var query = model.find(conditions).sort(sort).skip(skipFrom).limit(resultsPerPage);
    query.exec(function(error, results) {
        if (error) {
            callback(error, null, null);
        } else {
            model.count(conditions, function(error, count) {
                if (error) {
                    callback(error, null, null);
                } else {
                    paginate = new Paginate(pageNumber, resultsPerPage,count,results);
                    callback(null, paginate);
                }
            });
        }
    });
}

/**
 * get all model data
 * @param callback
 */
DaoBase.prototype.getAll = function (callback) {
    this.model.find({}, function(error,model){
        if(error) return callback(error,null);
        return callback(null, model);
    });
};

/**
 *  delete data with qurey
 * @param query
 * @param callback
 */
DaoBase.prototype.delete = function (query, callback){
    this.model.remove(query, function(error){
        if(error) return callback(error);

        return callback(null);
    });
};

/**
 * update data with conditions
 * @param conditions
 * @param update
 * @param options
 * @param callback
 */
DaoBase.prototype.update = function( conditions, update ,options, callback) {
    this.model.update(conditions, update, options, function (error) {
        if(error) return callback(error);
        return callback(null);
    });
};

/**
 * get filed distinct data
 * @param field
 * @param callback
 */
DaoBase.prototype.distinctFiled = function (field, callback) {
    this.model.distinct(field, function(error,model){
        if(error) return callback(error,null);
        return callback(null, model);
    });
};

module.exports = DaoBase;