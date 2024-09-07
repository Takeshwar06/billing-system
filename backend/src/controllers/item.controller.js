const asyncHandler = require("../utils/asyncHandler");
const Item = require("../models/item.model");
const ApiResponse = require("../utils/ApiResponse");
const Brand = require("../models/brand.model");

module.exports.getItems = asyncHandler(async (req, res, next) => {
  const items = await Item.find().populate("brand", "name");
  const brands = await Brand.find().populate("item", "brand");
  return res
    .status(201)
    .json(
      new ApiResponse(201, { items, brands }, "all item fetched successfully")
    );
});

module.exports.createItems = asyncHandler(async (req, res, next) => {
  const { items } = req.body;
  console.log(items);
  for (const element of items) {
    if (element.name.length < 4) {
      return next(
        new ApiError(
          400,
          `Item name should be at least 4 characters, error in ${element.name}`
        )
      );
    }
    if (element.brand.length < 4) {
      return next(
        new ApiError(
          400,
          `Brand name should be at least 4 characters, error in ${element.brand}`
        )
      );
    }
    const itemNameLower = element.name.toLowerCase();
    const brandNameLower = element.brand.toLowerCase();

    let item = await Item.findOne({ name: itemNameLower });
    if (!item) {
      item = await Item.create({
        name: itemNameLower,
        unit: element.unit,
        defaultRate: element.defaultRate,
      });
    }

    let brand = await Brand.findOne({ name: brandNameLower });
    if (!brand) {
      brand = await Brand.create({ name: brandNameLower });
    }

    if (!item.brand.includes(brand._id)) {
      item.brand.push(brand._id);
      await item.save();
    }

    if (!brand.item.includes(item._id)) {
      brand.item.push(item._id);
      await brand.save();
    }
  }
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Items Created successfully!"));
});
