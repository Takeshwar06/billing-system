const mongoose= require("mongoose");
const { Schema } = mongoose;

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [4, 'Name must be at least 4 characters long'],
      },
      location: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      }],
}, { timestamps: true })

module.exports = mongoose.model("Customer", customerSchema);

