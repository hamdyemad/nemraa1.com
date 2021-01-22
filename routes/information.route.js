const router = require('express').Router();
const multer = require('multer');
const informationModel = require('../models/information.model');
const fs = require('fs');
const verfication = require('../verfication/authorization');

let removeLogo = (logo) => {
  fs.unlinkSync(`images/information/${logo}`);
}

// Multer
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/information')
  },
  filename: (req, files, cb) => {
    cb(null, Date.now() + '-' + files.originalname)
  }
})
const upload = multer({ storage }).single('logo');


// patch information by id
router.patch('/information/:id', verfication.superAdminVerifyed, upload, (req, res) => {
  let io = req.app.get('io');
  let id = req.params.id;
  const body = req.body;
  informationModel.findByIdAndUpdate(id, {
    'socials.facebook': body.socials.facebook,
    'socials.instagram': body.socials.instagram,
    'socials.telegram': body.socials.telegram,
    'socials.watsappNumber': body.socials.watsappNumber,
    'location.address': body.location.address,
    'location.city': body.location.city,
    'location.country': body.location.country,
    companyName: body.companyName,
    aboutCompany: body.aboutCompany,
    email: body.email,
    qrCode: body.qrCode
  }).then((doc) => {
    if (req.file) {
      removeLogo(doc.logo);
      informationModel.findByIdAndUpdate(doc._id, { logo: req.file.filename }).then();
    }
    io.emit('information');
    res.json({ message: 'تم التعديل بنجاح' })
  })
})


// get information by id
router.get('/information', verfication.verifyed, (req, res) => {
  informationModel.find({}).then((doc) => {
    res.json(doc);
  })
})




module.exports = router;