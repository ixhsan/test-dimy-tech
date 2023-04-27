var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Pool = require("pg").Pool;

var indexRouter = require("./routes/index");

var app = express();

const pool = new Pool({
  user: "ikhsan",
  host: "localhost",
  database: "testdb",
  password: "1234",
  port: 5432,
});

console.log(`Successfully connected to pgAdmin4`);

var customersRouter = require("./routes/customers")(pool);
var customerAddressRouter = require("./routes/customer_address")(pool);
var productRouter = require("./routes/product")(pool);
var paymentRouter = require("./routes/payment_method")(pool);
var transactionRouter = require("./routes/transaction")(pool);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/customers", customersRouter);
app.use("/customer_address/", customerAddressRouter);
app.use("/payment", paymentRouter);
app.use("/product", productRouter);
app.use("/transaction", transactionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
