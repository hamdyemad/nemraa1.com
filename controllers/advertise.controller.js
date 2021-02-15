const Product = require('../models/products.model');
const Advertise = require('../models/advertise.model');
const fs = require('fs')
function removeImage(image) {
    console.log(image)
    fs.unlink(`images/advertise-images/${image}`, (err) => {
        if (err) console.log(err, 'err');
    });
    console.log('advertise image deleted')
}
// start advertise

// get all advertise
exports.getAllAdvertise = (req, res) => {
    Advertise.find({}).then((doc) => {
        res.json(doc);
    })
}


// add advertise
exports.addAdvertise = (req, res) => {
    const body = req.body;
    if (req.file) {
        body['advertiseImage'] = req.file.filename;
        Advertise.find({}).then((doc) => {
            if (doc.length !== 0) {
                if (doc.find((docObj) => docObj.category == body.category ? docObj : null) !== undefined) {
                    Advertise.findOneAndUpdate({ category: body.category }, {
                        $push: {
                            advertisingsOfCategory: { advertiseImage: body.advertiseImage, advertiseLink: body.advertiseLink }
                        }
                    }).then(() => {
                        res.json({ message: "تم اضافة الأعلان بنجاح" })
                    })
                } else {
                    let newAdvertise = new Advertise({
                        category: body.category,
                        advertisingsOfCategory: [
                            {
                                advertiseImage: body.advertiseImage,
                                advertiseLink: body.advertiseLink
                            }
                        ]
                    })
                    newAdvertise.save().then(() => {
                        res.json({ message: "تم اضافة الأعلان بنجاح" })
                    })
                }
            } else {
                let newAdvertise = new Advertise({
                    category: body.category,
                    advertisingsOfCategory: [
                        {
                            advertiseImage: body.advertiseImage,
                            advertiseLink: body.advertiseLink
                        }
                    ]
                })
                newAdvertise.save().then(() => {
                    res.json({ message: "تم اضافة الأعلان بنجاح" })
                })
            }
        })
    }
}
// delete advertise by id
exports.deleteAdvertise = (req, res) => {
    const body = req.body;
    const id = req.params.id;
    Advertise.findOne({ category: body.category }).then((doc) => {
        let advertisingsOfCategory = doc.advertisingsOfCategory;
        advertisingsOfCategory.find((advertiseObj) => {
            if (advertiseObj._id == id) {
                removeImage(advertiseObj.advertiseImage);
                Advertise.findOneAndUpdate({ category: body.category }, {
                    $pull: {
                        advertisingsOfCategory: { _id: id }
                    }
                }).then(() => {
                    res.json({ message: "تم مسح الأعلان بنجاح" })
                })
            }
        })
    })
}
  // end advertise