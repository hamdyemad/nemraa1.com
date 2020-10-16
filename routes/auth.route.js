const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const verfication = require('../verfication/authorization');

/* POST register */
router.post("/register", verfication.superAdminVerifyed, authController.register);

/* POST login */
router.post("/login", authController.login);


/* PATCH update role */
router.patch('/role/:id', authController.updateRole)

module.exports = router;