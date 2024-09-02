const Customer = require("../models/customer.model");
const Location = require("../models/location.model");
const Item = require("../models/item.model");
const Brand = require("../models/brand.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");



module.exports.getCustomersLocationsItemsBrands = asyncHandler(async(req,res,next)=>{
    const customers = await Customer.find()
    .populate('location');

    const locations = await Location.find()
    .populate('customer');

    const items = await Item.find()
    .populate('brand');

    const brands = await Brand.find()
    .populate('item','name');
    return res.status(201).json(new ApiResponse(201,{
        customers,locations,items,brands
    },"success"))
})

module.exports.getCustomers = asyncHandler(async(req,res,next)=>{
    const customers = await Customer.find()
    .populate('location');
    return res.status(201).json(new ApiResponse(201, customers, 'all customer fetched successfully'));
})






