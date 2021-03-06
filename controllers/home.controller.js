const homeModel = require('../models/home.model');
const fs = require('fs');
// Delete Img fn
function deleteImg(img) {
    fs.unlink(`images/carousel-images/${img}`, (err) => {
        console.log('image has been removed');
        if (err) console.log(err, 'err');
    })
}

// toggle show of carousel
exports.toggleShowOfCarousel = (req, res) => {
    const id = req.params.id;
    const show = req.body.show;
    homeModel.findOneAndUpdate({ static: 'static', 'homeCarousel._id': id }, { 'homeCarousel.$.show': show }).then(() => {
        if (show == true) {
            res.json({ message: "تم تفعيل الأظهار", error: false })
        } else {
            res.json({ message: "تم تبطيل الأظهار", error: true })
        }
    })
}

exports.getAllCarousel = (req, res) => {
    homeModel.findOne().then(doc => {
        res.json(doc);
    })
}

exports.addNewCarousel = (req, res) => {
    const body = req.body;
    for (let i = 0; i < body.homeCarousel.length; i++) {
        let file = req.files.find(obj => obj.fieldname == `homeCarousel[${i}][carouselImage]`);
        body.homeCarousel[i].carouselImage = file.filename;
    }
    homeModel.findOne({}).then((doc) => {
        if (doc) {
            homeModel.findOneAndUpdate({ _id: doc._id }, {
                $push: { homeCarousel: body.homeCarousel }
            }).then(() => {
                res.json({ message: `تمت الأضافة بنجاح` })
            });
        } else {
            let newhomeModel = new homeModel({
                homeCarousel: body.homeCarousel
            })
            newhomeModel.save().then(() => {
                res.json({ message: `تمت الأضافة بنجاح` })
            })
        }
    })
}


exports.removeCarousel = (req, res) => {
    const id = req.params.id;
    homeModel.findOne({}).then((doc) => {
        doc.homeCarousel.find((carousel) => {
            if (carousel._id == id) {
                deleteImg(carousel.carouselImage);
                homeModel.findOneAndUpdate({ _id: doc._id }, { $pull: { 'homeCarousel': { _id: id } } }).then(() => {
                    res.json({ message: `${carousel.carouselHeader} تم مسح` })
                });
            }
        })
    })
}