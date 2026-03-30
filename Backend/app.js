const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get("/api", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(3000, () => console.log("Server running"));
