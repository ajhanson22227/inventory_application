const express = require('express');
const router = express.Router();

//Require controller modules
const item_controller = require('../controllers/itemController');
//const category_controller = require('../controllers/categoryController');

// ITEM ROUTES
router.get('/', item_controller.index);

//GET request to list all items
router.get('/items', item_controller.item_list)


// CATEGORY ROUTES


module.exports = router;