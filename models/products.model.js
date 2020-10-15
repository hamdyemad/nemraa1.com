const mongoose = require('mongoose');
let date = new Date();
const ProductSchema = mongoose.Schema({
    seq: Number,
    static: String,
    _categorys: Array,
    category: String,
    name: String,
    description: String,
    price: Number,
    discount: Number,
    unitPrice: Number,
    image: String,
    otherImages: Array,
    colors: {
        type: Array,
        default: []
    },
    addedDate: {
        type: String,
        default: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`
    }
});

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;