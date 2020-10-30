const Item = require('../models/item');
const Category = require('../models/category');
const ItemInstance = require('../models/iteminstance');
const { body, validationResult } = require('express-validator');
const async = require('async');


exports.category_list = function(req, res, next){
    Category.find({}, 'name description')
    .exec(function(err, list_categories){
        if (err) { return next(err)}
        res.render('category_list', {title: 'Categories', category_list: list_categories})
    })
}