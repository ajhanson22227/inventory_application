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

    },function(err, results){
        if (err) { return next(err)}
        if (results.item === null){
            const err = new Error('Item not found')
            err.status = 404
            return next(err)
        }
        res.render('item_detail', { title: results.item.name, item: results.item})
    })
}

exports.item_create_get = function(req, res, next){
    Category.find({}, 'name')
    .exec(function(err, categories){
        if (err) { return next(err)}
        res.render('item_form', {title: 'Create Item', categories: categories})
    })
}

exports.item_create_post = [
    body('name', 'Name Must Not Be Empty').trim().isLength({min:1}).escape(),
    body('description', 'Description Must Not Be Empty').trim().isLength({min:1}).escape(),
    body('price').escape(),
    body('stock').escape(),
    body('category').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category
        })
        if (!errors.isEmpty()){
            Category.find({}, 'name')
            .exec(function(err, categories){
                if (err) {return next(err)}
                res.render('item_form', {title: 'Create Item', item: item, categories: categories})
            })
        }
        else{
            item.save(function(err){
                if(err) {return next(err)}
                res.redirect(item.url)
            })
        }
    }   
]

exports.item_delete_get = function(req, res, next){
    Item.findById(req.params.id)
    .populate('category')
    .exec(function(err, item){
        if (err) { return next(err)}
        if (item === null) { res.redirect('/catalog/items')}
        res.render('item_delete', { title: 'Delete Item', item: item})
    })
}

exports.item_delete_post = function(req, res, next){
    Item.findByIdAndDelete(req.params.id, function deleteItem(err){
        if (err)  { return next(err) }
        res.redirect('/catalog/items')
    })
}