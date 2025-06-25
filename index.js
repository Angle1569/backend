const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Router = require("./project/routes/auth");
const PORT = process.env.PORT || 3000;
const productRoutes = require("./project/routes/product");
const saleBillRoutes = require("./project/routes/saleBill");
const Customer = require("./project/routes/customer");
const Invoice = require("./project/routes/invoice");
const OldMetal = require("./project/routes/oldMetal");
const RecPayement = require("./project/routes/receive");

const cors = require("cors");

require("dotenv").config();

const server = express();

// PdlxNntJ6Fwi3iT8

server.use(cors());
server.disable("x-powered-by");
server.use(cookieParser());
// server.use(express.urlencoded({ extended: false }));
server.use(express.urlencoded({ extended: true }));

server.use(express.json());

// server.use(
//   cors({
//     origin: "https://inventoryjew-production.up.railway.app",
//     credentials: true,
//   })
// );

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to database"))
  .catch((err) => console.log(err));

Router(server);

server.use("/api/products", productRoutes);

server.use("/api/sale-bills", saleBillRoutes);

server.use("/api/customer", Customer);

server.use("/api/invoice", Invoice);

server.use("/api/old-metal", OldMetal);
server.use("/api/payment", RecPayement);

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
