const router = require('express').Router();
const advertiseController = require('../controllers/advertise.controller');
const multer = require('multer');

// Multer of products
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/advertise-images')
    },
    filename: (req, files, cb) => {
        cb(null, Date.now() + '-' + files.originalname)
    }
})
const upload = multer({ storage }).single('advertiseImage')


// start advertise
router.get('/', advertiseController.getAllAdvertise);

// add new advertise
router.post('/', upload, advertiseController.addAdvertise);

// delete advertise by id
router.patch('/:id', advertiseController.deleteAdvertise);

// end advertise


module.exports = router;