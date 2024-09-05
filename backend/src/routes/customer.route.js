const express = require("express");
const { getCustomers, getCustomersLocationsItemsBrands, createCustomers } = require("../controllers/customer.controller");

const router = express.Router();

router.route("/get-customers").get(getCustomers);
router.route("/create-customers").post(createCustomers);
router.route("/get-all").get(getCustomersLocationsItemsBrands);

module.exports = router;  