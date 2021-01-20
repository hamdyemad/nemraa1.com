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
    homeModel.findOne({ static: 'static' }).then(doc => {
        res.json(doc);
    })
}

exports.addNewCarousel = (req, res) => {
    const body = req.body;

    for (let i = 0; i < body.homeCarousel.length; i++) {
        let file = req.files.find(obj => obj.fieldname == `homeCarousel[${i}][carouselImage]`);
        body.homeCarousel[i].carouselImage = file.filename;
    }
    homeModel.findOneAndUpdate({}, {
        $push: { homeCarousel: body.homeCarousel }
    }).then(() => {
        res.json({ message: "done" })
    });
}


exports.removeCarousel = (req, res) => {
    const id = req.params.id;
    homeModel.findOne({ static: 'static' }).then((doc) => {
        doc.homeCarousel.find((carousel) => {
            if (carousel._id == id) {
                deleteImg(carousel.carouselImage);
                homeModel.findOneAndUpdate({ static: 'static' }, { $pull: { 'homeCarousel': { _id: id } } }).then(() => {
                    res.json({ message: `بنجاح  تم مسح` })
                });
            }
        })
    })
}