const asyncHandler = require("../utils/asyncHandler");
const Customer = require("../models/customer.model");
const Bill = require("../models/bill.model");
const ApiError = require("../utils/ApiError");
const Item = require("../models/item.model");
const Brand = require("../models/brand.model");
const Location = require("../models/location.model");
const ApiResponse = require("../utils/ApiResponse");

function billDetailsValidation(
  customerName,
  customerLocation,
  billNumber,
  billDate,
  tax
) {
  if (customerName.length < 4) {
    return {
      success: false,
      message: "Customer name must be at lest 4 charctor",
    };
  }
  if (customerLocation.length < 4) {
    return {
      success: false,
      message: "Customer location must be at least 4 charctor",
    };
  }
  if (billNumber.length > 30) {
    return {
      success: false,
      message: "Bill Number must be at most 30 charctor",
    };
  }
  if (billDate.toString().length < 4) {
    return {
      success: false,
      message: "Bill date must be at least 4 charctor",
    };
  }
  if (
    [
      tax.basic,
      tax.netAmount,
      tax.CGST.percent,
      tax.SGST.percent,
      tax.IGST.percent,
    ].some((item) => item < 0)
  ) {
    return {
      success: false,
      message: "Tax should not be nagative",
    };
  }
  return {
    success: true,
  };
}

module.exports.createBill = asyncHandler(async (req, res, next) => {
  const { customerName, customerLocation, billNumber, billDate, items, tax } =
    req.body;

  const billValidation = billDetailsValidation(
    customerName,
    customerLocation,
    billNumber,
    billDate,
    tax
  );
  if (!billValidation.success) {
    return next(new ApiError(400, billValidation.message));
  }

  const billNoExist = await Bill.find({ number: billNumber });
  if (billNoExist.length > 0) {
    return res.status(200).json({ 
      success: false,  
      message: "Bill Number already exists; do you want to update?",
      billExist: true,
    });
  }

  const customerNameLower = customerName.toLowerCase();
  const customerLocationLower = customerLocation.toLowerCase();

  let customer = await Customer.findOne({ name: customerNameLower }).populate('location');
  if (!customer) {
    return next(
      new ApiError(
        400,
        `Customer Name ${customerNameLower} not exist`
      )
    );
  }
  // console.log(customer);
  if(!customer.location.some(lcn=>lcn.address===customerLocationLower)){
    return next(
      new ApiError(
        400,
        `Customer Name ${customerNameLower} with Location ${customerLocationLower} not exist`
      )
    );
  }
  const location = await Location.findOne({address:customerLocationLower});

  let basic = 0;

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

    let item = await Item.findOne({ name: itemNameLower }).populate("brand");
    if (!item) {
      return next(
        new ApiError(
          400,
          `Item ${itemNameLower} not exist`
        )
      );
    }
    if (!item.brand.some(bnd=>bnd.name===brandNameLower)) {
      return next(
        new ApiError(
          400,
          `Item ${itemNameLower} with Brand ${brandNameLower} not exist`
        )
      );
    }

    if (element.qty < 1) {
      return next(
        new ApiError(400, `Qty should be greater than 0, error in ${item.name}`)
      );
    }
    if (element.rate < 1) {
      return next(
        new ApiError(
          400,
          `Rate should be greater than 0, error in ${item.name}`
        )
      );
    }

    basic += element.rate * element.qty;
  }

  const bill = await Bill.create({
    customer: customer._id,
    location: location._id,
    number: billNumber,
    date: billDate,
    items: items,
    tax: {
      basic: basic,
      CGST: {
        percent: tax.CGST.percent,
        value: (basic * tax.CGST.percent) / 100,
      },
      SGST: {
        percent: tax.SGST.percent,
        value: (basic * tax.SGST.percent) / 100,
      },
      IGST: {
        percent: tax.IGST.percent,
        value: (basic * tax.IGST.percent) / 100,
      },
      netAmount:
        basic +
        (basic * tax.CGST.percent) / 100 +
        (basic * tax.SGST.percent) / 100 +
        (basic * tax.IGST.percent) / 100,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, bill, "bill created successfuly"));
});

module.exports.updateBill = asyncHandler(async (req, res, next) => {
  const { customerName, customerLocation, billNumber, billDate, items, tax } =
    req.body;

  const billValidation = billDetailsValidation(
    customerName,
    customerLocation,
    billNumber,
    billDate,
    tax
  );
  if (!billValidation.success) {
    return next(new ApiError(400, billValidation.message));
  }

  const billNoExist = await Bill.findOne({ number: billNumber });
  if (!billNoExist) {
    return next(
      new ApiError(404, `bill not found with this bill no. ${billNumber}`)
    );
  }

  const customerNameLower = customerName.toLowerCase();
  const customerLocationLower = customerLocation.toLowerCase();

  let customer = await Customer.findOne({ name: customerNameLower });
  if (!customer) {
    return next(
      new ApiError(
        400,
        `Customer->${customerNameLower} not exist`
      )
    );
  }
  if(!customer.location.some(lcn=>lcn.name===customerLocationLower)){
    return next(
      new ApiError(
        400,
        `Customer->${customerNameLower},${customerLocationLower} not exist`
      )
    );
  }

  let basic = 0;

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
      return next(
        new ApiError(
          400,
          `Item->${itemNameLower} not exist`
        )
      );
    }
    if (!item.brand.some(bnd=>bnd.name===brandNameLower)) {
      return next(
        new ApiError(
          400,
          `Item->${itemNameLower},${brandNameLower} not exist`
        )
      );
    }

    if (element.qty < 1) {
      return next(
        new ApiError(400, `Qty should be greater than 0, error in ${item.name}`)
      );
    }
    if (element.rate < 1) {
      return next(
        new ApiError(
          400,
          `Rate should be greater than 0, error in ${item.name}`
        )
      );
    }

    basic += element.rate * element.qty;
  }

  const updatedBill = await Bill.updateOne(
    { number: billNumber }, 
    {
      $set: {
        customer: customer._id,
        location: location._id,
        date: billDate,
        items: items, 
        tax: {
          basic: basic,
          CGST: {
            percent: tax.CGST.percent,
            value: (basic * tax.CGST.percent) / 100,
          },
          SGST: {
            percent: tax.SGST.percent,
            value: (basic * tax.SGST.percent) / 100,
          },
          IGST: {
            percent: tax.IGST.percent,
            value: (basic * tax.IGST.percent) / 100,
          },
          netAmount:
            basic +
            (basic * tax.CGST.percent) / 100 +
            (basic * tax.SGST.percent) / 100 +
            (basic * tax.IGST.percent) / 100,
        },
      },
    }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, updatedBill, "bill updated successfuly"));
});

// getAll bills

module.exports.getBills = asyncHandler(async (req, res, next) => {
    const { from, to } = req.body;

    // Initialize query object
    const query = {};

    // Build the query object based on 'from' and 'to' dates if provided
    if (from && to) {
        // Parse and format 'from' and 'to' dates
        const [fromYear, fromMonth, fromDay] = from.split('-');
        const [toYear, toMonth, toDay] = to.split('-');

        const startDate = `${fromYear}-${fromMonth}-${fromDay}T00:00:00.000Z`;
        const endDate = `${toYear}-${toMonth}-${toDay}T23:59:59.999Z`;

        // Add date range to query
        query.createdAt = {
            '$gte': new Date(startDate),
            '$lte': new Date(endDate)
        };
    }

    // Fetch bills with sorting by 'updatedAt' in descending order
        const bills = await Bill.find(query)
            .populate('customer', 'name')
            .populate('location', 'address')
            .sort({ createdAt: -1 }); // Sort by updatedAt in descending order

        return res.status(200).json(new ApiResponse(200, bills, 'Bills fetched successfully'));
  
});


// delete bill

module.exports.deleteBill = asyncHandler(async(req,res)=>{
  
    const { id } = req.params;
    if (!id) {
        return res.status(200).json({ success: false, message: 'Bill number is required' });
    }

        const result = await Bill.deleteOne({ number: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Bill not found' });
        }

        return res.status(200).json(new ApiResponse(200,  'Bill deleted successfully'));
})