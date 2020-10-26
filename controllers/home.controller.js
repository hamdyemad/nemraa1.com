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
    const carouselImgs = req.files.map(img => img.filename);
    if (carouselImgs.length > 3) {
        for (let img of carouselImgs) {
            deleteImg(img);
        }
        res.json({ message: "لا يسمح بأضافة أكثر من 3 صور" })
    } else {
        homeModel.findOne({ static: 'static' }).then(doc => {
            if (doc.carouselImgs.length > 3) {
                console.log(carouselImgs)
                for (let img of carouselImgs) {
                    deleteImg(img);
                }
                res.json({ message: "لا يسمح بأضافة أكثر من 3 صور" })
            }
            else {
                homeModel.updateOne({ static: 'static' }, {
                    $addToSet: {
                        carouselImgs: carouselImgs
                    }
                }).then(doc => {
                    res.json(doc)
                })
            }
        })

    }
}


exports.removeCarousel = (req, res) => {
    const carouselImg = req.params.carouselImg;
    homeModel.findOneAndUpdate({ static: 'static' }, {
        $pull: {
            carouselImgs: carouselImg
        }
    }).then((doc) => {
        deleteImg(carouselImg);
        res.json(doc);
    })
}