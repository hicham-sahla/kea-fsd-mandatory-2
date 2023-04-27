require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkUser } = require("./middleware/authMiddleware");
const connectDB = require("./config/dbConn");

// Connect to MongoDB
connectDB();

// Defining routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes") 
const emailRouter = require("./routes/emailRoutes");

// middleware & static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/css",express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

// set the view engine to ejs
app.set("view engine", "ejs");
app.get("*", checkUser);
app.get("/", (req, res) => res.render("pages/home"));

// user routes
app.use(authRoutes);
app.use(userRoutes);
app.use(emailRouter);

// 404 page
app.use((req, res) => {
  res.status(404).render("pages/404", { title: "404" });
});

// Check if the connection to the database can be established
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
