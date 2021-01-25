const homeModel = require('../models/home.model');
const fs = require('fs');
// Delete Img fn
function deleteImg(img) {
    fs.unlink(`images/carousel-images/${img}`, (err) => {
        console.log('image has been removed');
        if (err) console.log(err, 'err');
    })
}

exports.getAllCarousel = (req, res) => {
    homeModel.findOne().then(doc => {
        res.json(doc);
    })
}

exports.addNewCarousel = (req, res) => {
    const body = req.body;
    let io = req.app.get('io');
    for (let i = 0; i < body.homeCarousel.length; i++) {
        let file = req.files.find(obj => obj.fieldname == `homeCarousel[${i}][carouselImage]`);
        body.homeCarousel[i].carouselImage = file.filename;
    }
    homeModel.findOne({}).then((doc) => {
        if (doc) {
            homeModel.findOneAndUpdate({ _id: doc._id }, {
                $push: { homeCarousel: body.homeCarousel }
            }).then(() => {
                io.emit('homeCarousel')
                res.json({ message: `تمت الأضافة بنجاح` })
            });
        } else {
            let newhomeModel = new homeModel({
                homeCarousel: body.homeCarousel
            })
            newhomeModel.save().then(() => {
                io.emit('homeCarousel')
                res.json({ message: `تمت الأضافة بنجاح` })
            })
        }
    })
}


exports.removeCarousel = (req, res) => {
    const id = req.params.id;
    let io = req.app.get('io');
    homeModel.findOne({}).then((doc) => {
        doc.homeCarousel.find((carousel) => {
            if (carousel._id == id) {
                deleteImg(carousel.carouselImage);
                homeModel.findOneAndUpdate({ _id: doc._id }, { $pull: { 'homeCarousel': { _id: id } } }).then(() => {
                    io.emit('homeCarousel')
                    res.json({ message: `${carousel.carouselHeader} تم مسح` })
                });
            }
        })
    })
}