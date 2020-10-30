const Item = require('../models/item');
const Category = require('../models/category');
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

exports.category_create_get = function(req, res, next){
    res.render('category_form', {title: 'Create Category'})
}

exports.category_create_post = [
    body('name').trim().isLength({min: 1}).escape().withMessage('Name is Required'),
    body('description').trim().isLength({min: 1}).escape().withMessage('Category is Required'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.render('category_form', {title: 'Create Category', category: req.body, errors: errors.array()})
            return
        }
        else{
            const category = new Category({
                name: req.body.name,
                description: req.body.description
            });
            category.save(function(err){
                if (err) { return next(err)}
                res.redirect(category.url)
            })
        }
    }
    
]