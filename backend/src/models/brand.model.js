const mongoose= require("mongoose");
const { Schema } = mongoose;

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [4, 'brand name must be at least 4 characters long'],
      },
      item: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      }],
}, { timestamps: true })

module.exports = mongoose.model("Brand", brandSchema);

