const express = require("express");
const { getBrands } = require("../controllers/brand.controller");

const router = express.Router();

router.route("/get-brands").get(getBrands);

module.exports = router;