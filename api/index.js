const express = require("express");
const bodyParser = require("body-parser");
const { notFoundResponse } = require("../utils/responseManager");
const cors = require("cors");

// Routes
const homeRoutes = require("../routes/homeRoutes");
const serviceRoutes = require("../routes/serviceRoute");
const userRoutes = require("../routes/userRoutes");
const blogRoutes = require("../routes/blogRoutes");
const productRoutes = require("../routes/productRoutes");
const purohitRoutes = require("../routes/purohitRoutes");
const dailyRoutineRoutes = require("../routes/dailyRoutineRoutes");
const appointmentRoutes = require("../routes/appointmentRoutes");
const leadRoutes = require("../routes/leadRoutes");
const cashfreeRoutes = require("../routes/cashFreeRoutes");

const app = express();
const port = process.env.PORT || 3001;

// Define allowed origins
const allowedOrigins = [
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5500",
  "https://www.pujajyotish.com",
  "https://pujajyotish.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 🔹 Block Direct API Access (Postman, cURL, Unauthorized Sites)
app.use((req, res, next) => {
  const allowedReferrers = [
    "http://127.0.0.1:5501",
    "http://127.0.0.1:5500",
    "https://www.pujajyotish.com",
    "https://pujajyotish.com",
  ];

  const referrer = req.get("Referer") || req.get("Origin");

  // Block if referrer is missing or not in the allowed list
  if (!referrer || !allowedReferrers.some((url) => referrer.startsWith(url))) {
    return res
      .status(403)
      .json({ error: "Forbidden: Unauthorized Request not allowed" });
  }

  next();
});

// Middleware
app.use(bodyParser.json()); // to parse JSON request bodies

// User routes
app.use("/v1/home", homeRoutes);
app.use("/v1/services", serviceRoutes);

app.use("/v1/users", userRoutes);
app.use("/v1/blogs", blogRoutes);

app.use("/v1/products", productRoutes);
app.use("/v1/purohits", purohitRoutes);

app.use("/v1/dailyroutines", dailyRoutineRoutes);
app.use("/v1/appointments", appointmentRoutes);

app.use("/v1/leads", leadRoutes);
app.use("/v1/cashfree", cashfreeRoutes);


// Catch all route for 404 (route not found)
app.use((req, res) => {
  notFoundResponse(res, "Route not found");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the serverless function
module.exports = app;