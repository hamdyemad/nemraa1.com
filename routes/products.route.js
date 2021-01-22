const router = require('express').Router();
const productsController = require('../controllers/products.controller');
const verfication = require('../verfication/authorization');
const multer = require('multer');

// Multer
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, files, cb) => {
        cb(null, Date.now() + '-' + files.originalname)
    }
})
const upload = multer({ storage }).fields([
    { name: 'image' },
    { name: 'otherImages' },
    { name: 'reviews' }
])

// GET get product by options
router.get('/', productsController.getProductsByOptions);

// get related products
router.post('/related', productsController.getRelatedProducts)

// POST add new product
router.post('/', verfication.superAdminVerifyed, upload, productsController.addNewProduct);

// GET get static
router.get('/static', productsController.getAllCategorys);
// PATCH update static
router.patch('/static', verfication.superAdminVerifyed, productsController.updateStatic);


// DELETE delete product color
router.patch('/colorAndSize/:id', verfication.superAdminVerifyed, productsController.deleteColorAndSize)

// DELETE reviews by id
router.patch('/reviews/:id', verfication.superAdminVerifyed, productsController.deleteReview)

// PATCH update product
router.patch('/:id', verfication.superAdminVerifyed, upload, productsController.updateProduct);

// GET get product by id
router.get('/:id', productsController.getProductById)

// GET get product by name
router.get('/product/:name', productsController.getProductByName)

// DELETE delete product by id
router.delete('/:id', verfication.superAdminVerifyed, productsController.deleteProduct)




module.exports = router;