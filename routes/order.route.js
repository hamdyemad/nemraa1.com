const router = require("express").Router();
const verfication = require("../verfication/authorization");
const ordersController = require("../controllers/orders.controller");

/* POST add order  */
router.post('/', ordersController.addOrder);

/* GET get all orders && by query  */
router.get("/", ordersController.getAllOrders);

/* GET get orders invoices */
router.post('/invoices', ordersController.getOrdersByPassTheSeqs);

/* GET get order by id */
router.get('/:id', ordersController.getOrderById);

/* DELETE delete order by id */
router.delete('/:id', verfication.verifyed, ordersController.deleteOrderById);

/* POST add status histroy */
router.post('/history/:id', ordersController.addStatusHistory);

module.exports = router;