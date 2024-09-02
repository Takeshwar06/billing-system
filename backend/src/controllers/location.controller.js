const asyncHandler = require("../utils/asyncHandler");
const Location = require("../models/location.model");
const ApiResponse = require("../utils/ApiResponse");


module.exports.getLocations = asyncHandler(async(req,res,next)=>{
    const locations = await Location.find()
    .populate('customer');
    return res.status(201).json(new ApiResponse(201, locations, 'all location fetched successfully'));
})