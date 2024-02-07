const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const productRoutes = require("./routes/productRoute");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/users", productRoutes);
app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 5000; // Use process.env.PORT
const uri = process.env.ATLAS_URL;

app.listen(port, () => {
  console.log(`Server Running on port: ${port}`);
  console.log("MongoDb Connection established");
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDb Connection established");
  })
  .catch((error) => {
    console.error("MongoDb Connection failed:", error.message);
  });
