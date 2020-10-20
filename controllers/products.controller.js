const Product = require('../models/products.model');
const fs = require('fs');
// Delete Img fn
function deleteImg(img) {
  fs.unlink(`images/${img}`, (err) => {
    console.log('image has been removed');
    if (err) console.log(err, 'err');
  })
}

// GET get all category
exports.getAllCategorys = (req, res) => {
  Product.findOne({ static: 'static' }).then((doc) => {
    res.json(doc);
  })
}

// POST add new category
exports.addNewCategory = (req, res) => {
  Product.findOneAndUpdate({ static: 'static' }, {
    $addToSet: {
      _categorys: req.body.newCategory
    }
  })
    .then((doc) => {
      res.json(doc);
    })
}

// GET get product by options
exports.getProductsByOptions = (req, res) => {
  let query = req.query;
  if (Object.keys(query).length == 0) {
    /* GET get all products */
    Product.find({ $nor: [{ static: 'static' }] }).sort({ seq: -1, addedDate: -1 })
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

// GET get product by id
exports.getProductById = (req, res) => {
  let productId = req.params.id;
  Product.findById(productId).then((doc) => {
    res.json(doc);
  });
}


// POST add new Product
exports.addNewProduct = (req, res) => {
  const body = req.body;
  Product.findOne({ name: body.name }).then((doc) => {
    if (doc) {
      res.json({ message: "يوجد منتج بهذاالأسم" });
      deleteImg(req.files.image[0].filename);
      let images = req.files.otherImages.map(x => x.filename);
      for (let image of images) {
        deleteImg(image)
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
          discount: body.discount,
          unitPrice: body.price - (body.price * body.discount / 100),
          video: body.video,
          image: req.files.image[0].filename
        });
        newProduct.save().then((doc) => {
          if (req.files.otherImages) {
            Product.findOneAndUpdate({ _id: doc._id }, { otherImages: req.files.otherImages.map(x => x.filename) }).then()
          }
          Product.findOneAndUpdate({ static: 'static' }, { $addToSet: { _categorys: [body.category] } })
            .then(() => {
              res.json(doc)
            })
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
  console.log(req.files)
  Product.findByIdAndUpdate(req.params.id, {
    name: body.name,
    description: body.description,
    facebookPexel: body.facebookPexel,
    category: body.category,
    price: body.price,
    colors: body.colors,
    sizes: body.sizes,
    discount: body.discount,
    unitPrice: body.price - (body.price * body.discount / 100),
    video: body.video,
    image: body.image,
    otherImages: body.otherImages
  }).then((doc) => {
    if (req.files.image) {
      Product.findByIdAndUpdate(req.params.id, {
        image: req.files.image[0].filename
      }).then((resImage) => {
        deleteImg(doc.image);
        console.log(resImage, 'main image deleted')
      })
    }
    if (req.files.otherImages) {
      Product.findByIdAndUpdate(req.params.id, {
        otherImages: req.files.otherImages.map(x => x.filename)
      }).then((resOtherImages) => {
        for (let image of doc.otherImages) {
          deleteImg(image);
        }
        console.log(resOtherImages, 'otherImages deleted')
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
      for (let image of doc.otherImages) {
        deleteImg(image);
      }
      Product.deleteOne({ _id: req.params.id }).then((val) => {
        res.json(val);
      })
    }
  })
}

// DELETE delete color by id
exports.deleteColorAndSize = (req, res) => {
  Product.findByIdAndUpdate(req.params.id, {
    $pull: { colors: req.body.color, sizes: req.body.size }
  }).then((doc) => {
    res.json(doc);
  })
}