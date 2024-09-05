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

    const locations = await Location.find()
    .populate('customer');
    return res.status(201).json(new ApiResponse(201, {customers,locations}, 'all customer fetched successfully'));
})

module.exports.createCustomers = asyncHandler(async(req,res,next)=>{
    const {customers}=req.body;

    for (const element of customers) {
        if (element.name.length < 4) {
          return next(
            new ApiError(
              400,
              `Customer name should be at least 4 characters, error in ${element.name}`
            )
          );
        }
        if (element.location.length < 4) {
          return next(
            new ApiError(
              400,
              `Location should be at least 4 characters, error in ${element.location}`
            )
          );
        }
        const customerNameLower = element.name.toLowerCase();
        const locationLower = element.location.toLowerCase();
    
        let customer = await Customer.findOne({ name: customerNameLower });
        if (!customer) {
            customer = await Customer.create({
            name: customerNameLower,
          });
        }
    
        let location = await Location.findOne({ name: locationLower });
        if (!location) {
            location = await Location.create({ address: locationLower });
        }
    
        if (!customer.location.includes(location._id)) {
            customer.location.push(location._id);
          await customer.save();
        }
    
        if (!location.customer.includes(customer._id)) {
            location.customer.push(customer._id);
          await location.save();
        }
    }
    return res.status(201).json(new ApiResponse(201, {}, 'Custoemrs created successfully'));
})




