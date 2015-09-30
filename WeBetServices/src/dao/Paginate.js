'use strict';

/**
 * Created by rock_zhu on 2015/3/11.
 */

/**
 *
 * @param page {Number} current page
 * @param perPage {Number} records of per page
 * @constructor
 */

var config = require('./../../config');

function Paginate(page, perPage, total, items){
    if(!page || page <1){
        page = 1;
    }
    if(!perPage || perPage<1){
        perPage = config.perPage;
    }
    this.page = page;
    this.perPage = perPage;

    if(!items) {
        items = [];
    }
    this.total = total;
    if(this.total % this.perPage === 0){
        this.pages = parseInt(this.total/this.perPage);
    }else{
        this.pages = parseInt(this.total /this.perPage) + 1;
    }
    this.items = items;
}

/**
 * set current page
 * @param page {Number}
 */
Paginate.prototype.setPage = function(page){
    this.page = page;
}

/**
 * set counts of every page
 * @param perPage
 */
Paginate.prototype.setPerPage = function(perPage){
    this.perPage = perPage;
}

/**
 * is has previous page
 * @returns {boolean} true: has; false : does not has
 */
Paginate.prototype.hasPrevPage = function(){
    if(this.page >1){
        return true;
    }
    return false;
}

/**
 * previous page
 * @returns {number}
 */
Paginate.prototype.prevPage = function(){
    if(this.page <= 1){
        return 1;
    }
    return this.page-1;
}

/**
 * is has next page
 * @returns {boolean}  true: has; false : does not has
 */
Paginate.prototype.hasNextPage = function(){
    if(this.page < this.totalPage){
        return true;
    }
    return false;
}

/**
 * next page
 * @returns {*}
 */
Paginate.prototype.nextPage = function(){
    if(this.page < this.pages){
        return this.page+1;
    }
    return this.pages;
}

module.exports = Paginate;