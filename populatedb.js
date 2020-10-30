#! /usr/bin/env node

console.log('This script populates some items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
const Item = require('./models/item')
const Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []
var iteminstances = []


function itemCreate(name, description, category, price, stock, cb){
    itemdetail = {
        name: name,
        description: description,
        category: category,
        price: price,
        stock: stock
    }
    var item = new Item(itemdetail);
    item.save(function(err){
        if (err){
            cb(err, null)
            return
        }
        console.log('New Item: ' + item)
        items.push(item)
        cb(null, item)
    })
}

function categoryCreate(name, description, cb){
    var category = new Category({name: name, description: description})
    category.save(function(err){
        if (err){
            cb(err, null)
            return
        }
        console.log('New Category: ' + category)
        categories.push(category)
        cb(null, category)
    })
}

function createCategories(cb){
    async.parallel([
        function(callback){
            categoryCreate('Shirts', 'This is for all your shirts', callback)
        },
        function(callback){
            categoryCreate('Pants', 'This is for all your pants', callback)
        },
        function(callback){
            categoryCreate('Shoes', 'This is for all your shoes', callback)
        },
        function(callback){
            categoryCreate('Accessories', 'This is for all your accessories', callback)
        }
        ],
        cb)
}

function createItems(cb){
    async.parallel([
        function(callback){
            itemCreate('Tank Top', 'A Sleveless Shirt', categories[0], 6, 10, callback)
        },
        function(callback){
            itemCreate('Long Sleeved', 'Covers Your Entire Arm', categories[0], 10, 11, callback)
        },
        function(callback){
            itemCreate('Jeans', 'Pants Made of Denim', categories[1], 14, 10, callback)
        },
        function(callback){
            itemCreate('Shorts', 'Show Off Your Knees', categories[1], 12, 10, callback)
        },
        function(callback){
            itemCreate('Sneakers', 'Helps You Sneak', categories[2], 25, 3, callback)
        },
        function(callback){
            itemCreate('Heels', 'Grow A Couple Inches', categories[2], 20, 5, callback)
        },
        function(callback){
            itemCreate('Scarf', 'Warms You Up In Winter', categories[3], 5, 20, callback)
        },
        function(callback){
            itemCreate('Belt', 'Keeps Your Pants From Falling', categories[3], 13, 8, callback)
        }
    ],
    cb)
}



async.series([
    createCategories,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Not Errr');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});


