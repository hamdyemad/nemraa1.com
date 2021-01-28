const mongoose = require('mongoose');

let doDate = (number) => {
    return (+number < 10) ? number = `${0}${number}` : number;
}
let date = new Date();
let month = `${date.getMonth() + 1}`;
let day = `${date.getDate()}`;
month = doDate(month);
day = doDate(day);
const ProductSchema = mongoose.Schema({
    seq: Number,
    static: String,
    _categories: Array,
    category: String,
    name: String,
    description: String,
    price: Number,
    discount: Number,
    unitPrice: Number,
    amount: Number,
    facebookPexel: String,
    youtubeVideo: String,
    image: String,
    reviews: {
        type: Array,
        default: []
    },
    sizes: {
        type: Array,
        default: []
    },
    colors: {
        type: Array,
        default: []
    },
    otherImages: {
        type: Array,
        default: []
    },
    addedDate: {
        type: String,
        default: `${date.getFullYear()}-${month}-${day}`
    },
    DateAdded: {
        type: Date,
        default: new Date()
    }
});

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;