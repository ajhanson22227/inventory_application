const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemInstanceSchema = new Schema({
    item: {type: Schema.Types.ObjectId, ref: 'Item', required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true}
})

module.exports = mongoose.model('ItemInstance', ItemInstanceSchema);