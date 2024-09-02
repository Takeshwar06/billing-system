const asyncHandler = require("../utils/asyncHandler");
const Item = require("../models/item.model");
const ApiResponse = require("../utils/ApiResponse");


module.exports.getItems = asyncHandler(async(req,res,next)=>{
    const items = await Item.find()
    .populate('brand');
    return res.status(201).json(new ApiResponse(201, items, 'all item fetched successfully'));
})