const mongoose = require("mongoose");

let doDate = (number) => {
  return +number < 10 ? (number = `${0}${number}`) : number;
};
let date = new Date();
let month = `${date.getMonth() + 1}`;
let day = `${date.getDate()}`;
month = doDate(month);
day = doDate(day);
const ProductSchema = mongoose.Schema({
  seq: Number,
  static: String,
  _categories: [
    {
      categoryImage: {
        required: true,
        type: String,
      },
      order: {
        required: true,
        type: String,
      },
      category: {
        required: true,
        type: String,
      },
      show: {
        required: true,
        type: Boolean,
        default: false,
      },
    },
  ],
  category: String,
  category_id: String,
  name: String,
  description: String,
  price: Number,
  discount: Number,
  unitPrice: Number,
  amount: Number,
  isOffer: Boolean,
  isBreakable: Boolean,
  youtubeVideo: String,
  image: String,
  reviews: {
    type: Array,
    default: [],
  },
  sizes: {
    type: Array,
    default: [],
  },
  colors: {
    type: Array,
    default: [],
  },
  otherImages: {
    type: Array,
    default: [],
  },
  addedDate: {
    type: String,
    default: `${date.getFullYear()}-${month}-${day}`,
  },
  DateAdded: {
    type: Date,
    default: new Date(),
  },
});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;
