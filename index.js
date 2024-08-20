require("dotenv").config();
const { rateLimit } = require("express-rate-limit");
const express = require("express");
const cors = require("cors");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

const PORT = process.env.PORT;

const QRRouter = require("./routes/qr");

app.get("/", (req, res) => {
  res.send("");
});

app.use("/qr", QRRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
