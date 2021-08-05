const router = require("express").Router();
const verfication = require("../verfication/authorization");
const ordersController = require("../controllers/orders.controller");

/* POST add order  */
router.post("/", verfication.verifyed, ordersController.addOrder);
/* POST add order  */
router.post("/user", ordersController.addOrder);

/* GET get all orders && by query  */
router.get("/", verfication.verifyed, ordersController.getOrders);

/* GET get complted orders */
router.get(
  "/completed",
  verfication.verifyed,
  ordersController.getAllCompletedOrders
);

/* POST post add orders to admins view */
router.post(
  "/addToAdminView",
  verfication.superAndAdminVerifed,
  ordersController.addOrderShowWithAdmin
);

/* PATCH update orders to admins view */
router.patch(
  "/addToAdminView",
  verfication.superAndAdminVerifed,
  ordersController.removeOrderShowWithAdmin
);

/* GET get static */
router.get("/static", verfication.verifyed, ordersController.getStatic);

/* POST update statused of static */
router.post(
  "/static",
  verfication.superAdminVerifyed,
  ordersController.updateStatus
);

/* PATCH status by status name */
router.patch(
  "/static",
  verfication.superAdminVerifyed,
  ordersController.removeStatus
);

/* GET get orders invoices */
router.post(
  "/invoices",
  verfication.verifyed,
  ordersController.getOrdersByPassTheSeqs
);

/* POST add status histroy */
router.post(
  "/history/details/:id",
  verfication.verifyed,
  ordersController.addStatusHistory
);

/* POST add many of history */
router.post(
  "/history",
  verfication.superAndAdminVerifed,
  ordersController.addManyOfHistory
);

/* PATCH update order by id */
router.patch(
  "/:id",
  verfication.superAndAdminVerifed,
  ordersController.updateOrderById
);

/* GET get order by id */
router.get("/:id", verfication.verifyed, ordersController.getOrderById);

/* DELETE delete order by id */
router.delete(
  "/:id",
  verfication.superAdminVerifyed,
  ordersController.deleteOrderById
);

module.exports = router;
