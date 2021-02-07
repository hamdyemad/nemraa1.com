const Product = require('../models/products.model');
const fs = require('fs');
// Delete Img fn
function deleteImg(img) {
  fs.unlink(`images/${img}`, (err) => {
    if (err) console.log(err, 'err');
  })
}

// GET get all category
exports.getAllCategorys = (req, res) => {
  Product.findOne({ static: 'static' }).then((doc) => {
    res.json(doc);
  })
}

// update category of static
exports.updateStatic = (req, res) => {
  const body = req.body;
  let file;
  if (req.files) {
    file = req.files.categoryImage[0];
    body['categoryImage'] = file.filename;
  }
  let updatedObj = {};
  if (body.title) {
    if (body.title == 'add') {
      updatedObj['$push'] = { _categories: body }
      Product.findOne({ static: 'static' }).then((doc) => {
        let catObj = doc._categories.find((catObj) => catObj.category == body.category);
        if (catObj) {
          if (file) {
            deleteImg(file.filename);
          }
          res.json({ message: "هذا الصنف موجود بالفعل", error: true })
        } else {
          Product.findOneAndUpdate({ static: 'static' }, updatedObj).then(() => {
            res.json({ message: `بنجاح ${body.category} تم أضافة`, error: false });
          })

        }
      })
    } else {
      Product.findOne({ static: 'static' }).then((doc) => {
        let catObj = doc._categories.find((catObj) => catObj.category == body.category);
        if (catObj) {
          deleteImg(catObj.categoryImage);
          Product.findOneAndUpdate({ static: 'static' }, { $pull: { _categories: { category: body.category } } }).then(() => {
            res.json({ message: `${body.category} تم ازالة` });
          })
        } else {
          if (file) {
            deleteImg(file.filename);
          }
          res.json({ message: "يوجد خطأ ما" })
        }
      })
    }

  }

}


// GET get product by options
exports.getProductsByOptions = (req, res) => {
  let query = req.query;
  if (Object.keys(query).length == 0 || query.category == 'all') {
    /* GET get all products */
    Product.find({ $nor: [{ static: 'static' }] }).sort({ name: 1, addedDate: -1 })
      .then((doc) => {
        res.json(doc)
      })
  } else {
    /* GET get products by query */
    Product.find({
      $nor: [{ static: 'static' }],
      $or: [
        { category: query.category },
        { seq: query.id },
        { name: new RegExp([`^${query.name}`]) },
        { addedDate: query.addedDate }
      ],
    }).then((doc) => {
      res.json(doc)
    })
  }
}

// GET get related product by category
exports.getRelatedProducts = (req, res) => {
  Product.find({ category: req.body.category, $nor: [{ _id: req.body.id }] }).then((doc) => {
    const filterdDoc = doc.map(val => {
      return {
        _id: val._id,
        seq: val.seq,
        name: val.name,
        image: val.image,
        unitPrice: val.unitPrice,
        category: val.category
      }
    })
    res.json(filterdDoc);
  })
}


// GET get product by id
exports.getProductById = (req, res) => {
  let productId = req.params.id;
  Product.findById(productId).then((doc) => {
    res.json(doc);
  });
}
// GET get product by name
exports.getProductByName = (req, res) => {
  let name = req.params.name;
  Product.findOne({ name: name }).then((doc) => {
    res.json(doc);
  });
}

exports.getSuggestProducts = (req, res) => {
  let name = req.params.name;
  Product.find({ $nor: [{ static: 'static' }], name: new RegExp([`^${name}`]) }).then((doc) => {
    if (doc.length !== 0) {
      let filteredProducts = doc.map((obj) => {
        return {
          _id: obj._id,
          image: obj.image,
          name: obj.name
        }
      })
      res.json(filteredProducts);
    }
  })
}


// POST add new Product
exports.addNewProduct = (req, res) => {
  const body = req.body;
  if (body.discount == 'null' || body.discount == '') {
    body.discount = 0;
  }
  Product.findOne({ name: body.name }).then((doc) => {
    if (doc) {
      res.json({ message: "يوجد منتج بهذا الأسم" });
      deleteImg(req.files.image[0].filename);
      if (req.files.reviews) {
        const reviewsImages = req.files.reviews.map(x => x.filename);
        for (let review of reviewsImages) {
          deleteImg(review)
        }
      }
      if (req.files.otherImages) {
        const images = req.files.otherImages.map(x => x.filename);
        for (let image of images) {
          deleteImg(image)
        }
      }
    } else {
      Product.findOneAndUpdate({ static: 'static' }, { $inc: { seq: 1 } }).then((doc) => {
        let newProduct = new Product({
          seq: doc.seq,
          name: body.name,
          description: body.description,
          facebookPexel: body.facebookPexel,
          colors: body.colors,
          sizes: body.sizes,
          category: body.category,
          price: body.price,
          amount: body.amount,
          discount: body.discount,
          unitPrice: (body.price - body.discount),
          youtubeVideo: body.youtubeVideo,
          image: req.files.image[0].filename
        });
        newProduct.save().then((doc) => {
          if (req.files.otherImages) {
            Product.findOneAndUpdate({ _id: doc._id }, { otherImages: req.files.otherImages.map(x => x.filename) }).then()
          }
          if (req.files.reviews) {
            for (let i = 0; i < req.files.reviews.length; i++) {
              body.reviews[i].reviewerImage = req.files.reviews[i].filename
            }
            Product.findOneAndUpdate({ _id: doc._id },
              { $push: { reviews: body.reviews } }).then()

          }
          res.json(doc)
        }).catch(err => {
          console.log(err)
        })
      })

    }
  })
    .catch((err) => {
      console.log(err)
    })
}


// PATCH update product
exports.updateProduct = (req, res) => {
  const body = req.body;
  let sizes; (body.sizes) ? sizes = body.sizes : sizes = [];
  let otherImages; (body.otherImages) ? otherImages = body.otherImages : otherImages = [];
  if (body.discount == 'null' || body.discount == '') {
    body.discount = 0;
  }

  Product.findByIdAndUpdate(req.params.id, {
    name: body.name,
    description: body.description,
    facebookPexel: body.facebookPexel,
    category: body.category,
    price: body.price,
    amount: body.amount,
    colors: body.colors,
    sizes: sizes,
    discount: body.discount,
    unitPrice: (body.price - body.discount),
    youtubeVideo: body.youtubeVideo,
    image: body.image,
    otherImages: otherImages
  }).then((doc) => {
    if (req.files.image) {
      Product.findByIdAndUpdate(req.params.id, {
        image: req.files.image[0].filename
      }).then((resImage) => {
        deleteImg(doc.image);
        console.log('main image deleted')
      })
    }
    if (req.files.reviews) {
      for (let i = 0; i < req.files.reviews.length; i++) {
        body.reviews[i].reviewerImage = req.files.reviews[i].filename;
        Product.findByIdAndUpdate(req.params.id, {
          $push: { reviews: body.reviews[i] }
        }).then()
      }
    }
    if (req.files.otherImages) {
      Product.findByIdAndUpdate(req.params.id, {
        otherImages: req.files.otherImages.map(x => x.filename)
      }).then((resOtherImages) => {
        for (let image of doc.otherImages) {
          deleteImg(image);
        }
        console.log('otherImages deleted')
      })
    }
    res.json(doc);
  })
    .catch()
}


// DELETE delete product by id
exports.deleteProduct = (req, res) => {
  Product.findOne({ _id: req.params.id }).then((doc) => {
    if (doc) {
      deleteImg(doc.image);
      for (let review of doc.reviews) {
        deleteImg(review.reviewerImage)
      }
      for (let image of doc.otherImages) {
        deleteImg(image);
      }
      Product.deleteOne({ _id: req.params.id }).then((val) => {
        res.json(val);
      })
    }
  })
}

// DELETE delete color & size by id
exports.deleteColorAndSize = (req, res) => {
  Product.findByIdAndUpdate(req.params.id, {
    $pull: { colors: req.body.color, sizes: req.body.size }
  }).then((doc) => {
    res.json(doc);
  })
}

// DELETE reviews by id
exports.deleteReview = (req, res) => {
  Product.findById(req.params.id).then(doc => {
    Product.updateOne({ _id: doc._id }, {
      $pull: { reviews: { reviewerName: req.body.reviewerName } }
    }).then(val => {
      deleteImg(req.body.reviewerImage);
      res.json({ message: `${req.body.reviewerName} تم مسح` });
    })
  })
}