const express = require('express');
const router = express.Router();

//Require controller modules
const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');

// ITEM ROUTES
router.get('/', item_controller.index);

//Get request for creating an item
router.get('/item/create', item_controller.item_create_get)
//POST request for creating an item
router.post('/item/create', item_controller.item_create_post)
//GET request to delete item
router.get('/item/:id/delete', item_controller.item_delete_get)
//POST request to delete item
router.post('/item/:id/delete', item_controller.item_delete_post)

//GET request to list all items
router.get('/items', item_controller.item_list);

//GET request item details
router.get('/item/:id', item_controller.item_detail);


// CATEGORY ROUTES

//GET request for creating a category
router.get('/category/create', category_controller.category_create_get)
//POST request for creating a category
router.post('/category/create', category_controller.category_create_post)
//GET request to delete category
router.get('/category/:id/delete', category_controller.category_delete_get)
//Post request to delete category
router.post('/category/:id/delete', category_controller.category_delete_post)

//GET request to list all categories
router.get('/categories', category_controller.category_list)

//GET request display category and it's contents
router.get('/category/:id', category_controller.category_detail)




module.exports = router;
