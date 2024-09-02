const asyncHandler = require("../utils/asyncHandler");
const Brand = require("../models/brand.model");
const ApiResponse = require("../utils/ApiResponse");


module.exports.getBrands = asyncHandler(async(req,res,next)=>{
    const brands = await Brand.find()
    .populate('item','name');
    return res.status(201).json(new ApiResponse(201, brands, 'all brands fetched successfully'));
})