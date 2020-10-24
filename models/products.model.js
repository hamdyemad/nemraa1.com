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
    facebookPexel: String,
    video: String,
    image: String,
    sizes: {
        type: Array,
        default: []
    },
    otherImages: {
        type: Array,
        default: []
    },
    colors: {
        type: Array,
        default: []
    },
    addedDate: {
        type: String,
        default: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
});

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;