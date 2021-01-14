const router = require('express').Router();
const productModel = require('../models/products.model');


// get all carts
router.post('/', (req, res) => {

    let body = req.body;
    if (body.length !== 0) {
        let _ids = body.map((val) => {
            return { _id: val._id }
        })
        productModel.find({ $or: _ids }).then((doc) => {
            let carts = [];
            body.forEach((bodyValue) => {
                doc.map((val) => {
                    if (val._id == bodyValue._id) {
                        carts.push({
                            _id: val._id,
                            name: val.name,
                            facebookPexel: val.facebookPexel,
                            category: val.category,
                            image: val.image,
                            unitPrice: val.unitPrice,
                            amount: +bodyValue.amount,
                            colors: bodyValue.colors,
                            sizes: bodyValue.sizes ? val.sizes : []
                        })
                    }
                })
            })
            res.json(carts);
        })
    }
})

module.exports = router;