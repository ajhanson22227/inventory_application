const Item = require('../models/item');
const Category = require('../models/category');
const ItemInstance = require('../models/iteminstance');
const { body, validationResult } = require('express-validator');
const async = require('async');
const category = require('../models/category');


exports.category_list = function(req, res, next){
    Category.find({}, 'name description')
    .exec(function(err, list_categories){
        if (err) { return next(err)}
        res.render('category_list', {title: 'Categories', category_list: list_categories})
    })
}

exports.category_detail = function(req, res, next){
    async.parallel({
        category: function(callback){
            Category.findById(req.params.id)
            .exec(callback)
        },
        items: function(callback){
            Item.find({'category': req.params.id})
            .exec(callback)
        }
    }, function(err, results){
        if (err) { return next(err) }
        if (results.category === null){
            const err = new Error('Category Not Found')
            err.status = 404
            return next(err)
        }
        res.render('category_detail', { title: results.category.name, items: results.items })
    })
}