const express = require("express");
const { getItems } = require("../controllers/item.controller");

const router = express.Router();

router.route("/get-items").get(getItems);

module.exports = router;