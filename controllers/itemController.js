const Item = require('../models/item');
const Category = require('../models/category');
const ItemInstance = require('../models/iteminstance');
const { body, validationResult } = require('express-validator');
const async = require('async');

exports.index = function(req, res){
    async.parallel({
        item_count: function(callback){
            Item.countDocuments({}, callback);
        },
        category_count: function(callback){
            Category.countDocuments({}, callback);
        }
    }, function(err, results){
        res.render('index', { title: 'Inventory Home', error: err, data: results});
    })
}

exports.item_list = function(req, res, next){

    Item.find({}, 'name description')
    .exec(function(err, list_items){
        if (err) {return next(err)}
        res.render('item_list', {title: 'Item List', item_list: list_items})
    })
}

exports.item_detail = function(req, res, next){
    async.parallel({
        item: function(callback){
            Item.findById(req.params.id)
            .populate('category')
            .exec(callback)
        },
        item_instance: function(callback){
            ItemInstance.find({'item': req.params.id})
            .exec(callback)
        }
    },function(err, results){
        if (err) { return next(err)}
        if (results.item === null){
            const err = new Error('Item not found')
            err.status = 404
            return next(err)
        }
        res.render('item_detail', { title: results.item.name, item: results.item, item_instance: results.item_instance})
    })
}