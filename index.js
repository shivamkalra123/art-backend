const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const productRoutes = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoute");
const paymentRoute = require("./routes/paymentRoute");

require("dotenv").config();

const app = express();
const server = http.createServer(app); // Wrap Express app with HTTP server
const io = socketIo(server); // Attach Socket.IO to the HTTP server

app.use(express.json());
app.use(
  cors({
    origin: "*", // Replace with the actual origin of your React app
    credentials: true,
  })
);

app.use("/api/users", userRoute);
app.use("/api/users", productRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", cartRoutes);
app.use("/api", paymentRoute);

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URL;

io.on("connection", (socket) => {
  console.log("A user connected");

  // Example: Listen for cart updates and broadcast them to all connected clients
  socket.on("cartUpdate", () => {
    io.emit("cartUpdate");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server Running on port: ${port}`);
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
