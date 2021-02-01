const router = require('express').Router();
const multer = require('multer');
const informationModel = require('../models/information.model');
const fs = require('fs');
const verfication = require('../verfication/authorization');

let removeLogo = (logo) => {
  fs.unlinkSync(`images/info-images/${logo}`);
}

// Multer
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/info-images')
  },
  filename: (req, files, cb) => {
    cb(null, Date.now() + '-' + files.originalname)
  }
})
const upload = multer({ storage }).single('logo');


// patch information by id
router.post('/info', upload, (req, res) => {
  let io = req.app.get('io');
  const body = req.body;
  informationModel.findOne({}).then((doc) => {
    if (doc) {
      informationModel.updateOne({ _id: doc._id }, {
        'socials.facebook': body.socials.facebook,
        'socials.instagram': body.socials.instagram,
        'socials.youtube': body.socials.youtube,
        'socials.watsappNumber': body.socials.watsappNumber,
        'location.city': body.location.city,
        'location.country': body.location.country,
        companyName: body.companyName,
        aboutCompany: body.aboutCompany,
        email: body.email,
        mobile: body.mobile,
        qrCode: body.qrCode,
        logo: body.logo
      }).then(() => {
        if (req.file) {
          let file = req.file.filename;
          if (doc.logo) {
            removeLogo(doc.logo);
          }
          informationModel.updateOne({ _id: doc._id }, { logo: file }).then();
        }
        io.emit('information');
        res.json({ message: 'تم التعديل بنجاح' })
      })
    } else {
      let newInformationModel = new informationModel({
        'socials.facebook': body.socials.facebook,
        'socials.instagram': body.socials.instagram,
        'socials.youtube': body.socials.youtube,
        'socials.watsappNumber': body.socials.watsappNumber,
        'location.city': body.location.city,
        'location.country': body.location.country,
        companyName: body.companyName,
        aboutCompany: body.aboutCompany,
        email: body.email,
        mobile: body.mobile,
        qrCode: body.qrCode,
        logo: body.logo
      });
      newInformationModel.save().then((doc) => {
        if (req.file) {
          let file = req.file.filename;
          informationModel.updateOne({ _id: doc._id }, { logo: file }).then();
        }
        io.emit('information');
        res.json({ message: 'تم التعديل بنجاح' })
      })
    }
  })
})


// get information by id
router.get('/info', (req, res) => {
  informationModel.findOne({}).then((doc) => {
    res.json(doc);
  })
})




module.exports = router;