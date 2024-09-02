const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
});

const taxSchema = new Schema({
    basic: {
            type: Number,
            required: true,
    },
    CGST: {
        percent: {
            type: Number,
            required:true
        },
        value: {
            type: Number,
        }
    },
    SGST: {
        percent: {
            type: Number,
            required:true
        },
        value: {
            type: Number,
        }
    },
    IGST: {
        percent: {
            type: Number,
            required: true,
        },
        value: {
            type: Number,
        }
    },
    netAmount: {
        type: Number,
        required: true,
    }
});

const billSchema = new Schema({
    number: {
        type: String,
        required: true,
        maxlength: [30, 'Bill number must be at most 30 characters long'],
    },
    date: {
        type: Date,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Assuming you have a Customer model
        required: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location', // Assuming you have a Location model
        required: true,
    },
    items: [itemSchema],
    tax: taxSchema,
}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);
