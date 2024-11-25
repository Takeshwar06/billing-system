const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error.middleware");
const ApiResponse = require("./utils/ApiResponse");
const ApiError = require("./utils/ApiError");
const asyncHandler = require("./utils/asyncHandler");
const billRoutes = require("./routes/bill.route");
const itemRoutes = require("./routes/item.route");
const locationRoutes = require("./routes/location.route");
const customerRoutes = require("./routes/customer.route");
const brandRoutes = require("./routes/brand.route");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://192.168.29.94:81");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

app.get("/user", (req, res) => {
  res.json({
    name: "tiger",
    age: 21,
  });
});
app.use("/api/bill", billRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/location", locationRoutes);
// error middelware
app.use(errorMiddleware);
module.exports = app;
