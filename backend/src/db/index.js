const { default: mongoose } = require("mongoose");
const { DB_NAME } = require("../constants");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      "\nMongoDB connected successfully: ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("\nMONGODB connection error ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
