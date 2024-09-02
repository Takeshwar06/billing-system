const mongoose= require("mongoose");
const { Schema } = mongoose;

const locationSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        minlength: [4, 'address must be at least 4 characters long'],
      },
      customer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
      }],
}, { timestamps: true })

module.exports = mongoose.model("Location", locationSchema);

