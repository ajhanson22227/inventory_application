const Item = require('../models/item');
const Category = require('../models/category');
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

    Item.find({}, 'name')
    .populate('name')
    .exec(function(err, list_items){
        if (err) {return next(err)}
        res.render('item_list', {title: 'Hellooo'})
    })

}