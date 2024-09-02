const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error.middleware");
const ApiResponse = require("./utils/ApiResponse");
const ApiError = require("./utils/ApiError");
const asyncHandler = require("./utils/asyncHandler");
const billRoutes = require("./routes/bill.route")
const itemRoutes = require("./routes/item.route")
const locationRoutes = require("./routes/location.route")
const customerRoutes = require("./routes/customer.route")
const brandRoutes = require("./routes/brand.route")


const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);


app.use("/api/bill",billRoutes);
app.use("/api/brand",brandRoutes);
app.use("/api/customer",customerRoutes);
app.use("/api/item",itemRoutes);
app.use("/api/location",locationRoutes);
// error middelware
// app.use(errorMiddleware);
module.exports = app;
