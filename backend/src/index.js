require("dotenv").config();
const app = require("./app");
const connectDB = require("./db");

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`server is running on port: ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.log("mongo db connection failed !!", err);
  });
