const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        enum: {
            values: ['kg', 'litre', 'piece', 'meter'], 
            message: '{VALUE} is not a valid unit, allowed values are kg, litre, piece, meter' 
        }, 
        required: true,
    },
    defaultRate: {
        type: Number,
        required: true,
    },

    brand: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
    }],
}, { timestamps: true })

module.exports = mongoose.model("Item", itemSchema);

