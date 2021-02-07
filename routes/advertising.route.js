const router = require('express').Router();
const advertisingModel = require('../models/advertising.model');
const verfication = require('../verfication/authorization');
const multer = require('multer');
const fs = require('fs');

let removeImg = (image) => {
  fs.unlinkSync(`images/advertising/${image}`);
  console.log('removed')
}

// Multer
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/advertising')
  },
  filename: (req, files, cb) => {
    cb(null, Date.now() + '-' + files.originalname)
  }
})
const upload = multer({ storage }).single('image');


router.get('/:role', (req, res) => {
  let role = req.params.role;
  if (role == 'upper') {
    advertisingModel.findOne({ role: role }).then((doc) => {
      res.json(doc)
    })
  } else {
    advertisingModel.find({ $nor: [{ role: 'upper' }] }).then((doc) => {
      res.json(doc)
    })
  }
})

router.post('/', verfication.superAdminVerifyed, upload, (req, res) => {
  const body = req.body;
  if (body.role == 'before-products' || body.role == 'after-products') {
    let newAdvertisingModel = new advertisingModel({ role: body.role, link: body.link, image: req.file.filename })
    newAdvertisingModel.save().then(() => {
      res.json({ message: 'تم اضافة الاعلان بنجاح' });
    })
  } else {
    res.json({ errMessage: "يوجد خطأ ما" })
    removeImg(req.file.filename);
  }
});

router.delete('/:id', verfication.superAdminVerifyed, (req, res) => {
  let id = req.params.id;
  advertisingModel.findById(id).then((doc) => {
    if (doc) {
      advertisingModel.findByIdAndDelete(id).then(() => {
        removeImg(doc.image);
        res.json({ message: "تم ازالة الأعلان بنجاح" })
      })
    }
  })
})





module.exports = router;