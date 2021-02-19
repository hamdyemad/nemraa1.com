const router = require('express').Router();
const productsController = require('../controllers/products.controller');
const verfication = require('../verfication/authorization');
const multer = require('multer');

// Multer of products
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
    { name: 'reviews' },
    { name: 'categoryImage' }
])

// GET get product by options
router.get('/', productsController.getProductsByOptions);

// get related products
router.post('/related', productsController.getRelatedProducts)

// POST add new product
router.post('/', verfication.superAdminVerifyed, upload, productsController.addNewProduct);

// GET get static
router.get('/static', productsController.getAllCategorys);

// toggle show of category
router.patch('/static/show', productsController.toggleShowOfCategory);

// PATCH update static
router.patch('/static', verfication.superAdminVerifyed, upload, productsController.updateStatic);

// DELETE delete product color
router.patch('/colorAndSize/:id', verfication.superAdminVerifyed, productsController.deleteColorAndSize)

// DELETE reviews by id
router.patch('/reviews/:id', verfication.superAdminVerifyed, productsController.deleteReview)

// PATCH update product
router.patch('/:id', verfication.superAdminVerifyed, upload, productsController.updateProduct);

// PATCH update product offer
router.patch('/offer/:id', verfication.superAndAdminVerifed, productsController.updateProductOfferById)

// GET get product by id
router.get('/:id', productsController.getProductById)
// GET get product by name
router.get('/product/:name', productsController.getProductByName)

// GET get products by name
router.get('/search/:name', productsController.getSuggestProducts)



// DELETE delete product by id
router.delete('/:id', verfication.superAdminVerifyed, productsController.deleteProduct)




module.exports = router;