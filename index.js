
const express = require("express");
const bodyParser = require("body-parser");
const { notFoundResponse } = require("./utils/responseManager");
const cors = require("cors");

// Routes
const homeRoutes = require("./routes/homeRoutes");
const serviceRoutes = require("./routes/serviceRoute");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const productRoutes = require("./routes/productRoutes");
const purohitRoutes = require("./routes/purohitRoutes");
const dailyRoutineRoutes = require("./routes/dailyRoutineRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

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


// Catch all route for 404 (route not found)
app.use((req, res) => {
  notFoundResponse(res, "Route not found");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
