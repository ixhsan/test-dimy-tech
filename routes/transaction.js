var express = require("express");
var router = express.Router();

/* GET users listing. */

module.exports = function (db) {
  router
    .route("/")
    .get(async function (req, res) {
      try {
        const { rows, rowCount } = await db.query(
          `SELECT * FROM transaction ORDER BY "id" ASC`
        );
        res.json({ transactions: rows, totaltransaction: rowCount });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .post(async function (req, res) {
      try {
        const { rows: newtransactions } = await db.query(
          `INSERT INTO transaction ("customer_id", "customer_address_id", "payment_method_id", "payment_amount", "transaction_date") VALUES($1,$2,$3,$4,$5) returning *`,
          [
            req.body.customer_id,
            req.body.customer_address_id,
            req.body.payment_method_id,
            req.body.payment_amount,
            req.body.transaction_date,
          ]
        );
        res.json({ transaction: newtransactions });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    });

  router
    .route("/:transaction_id")
    .get(async function (req, res) {
      try {
        const { rows, rowCount } = await db.query(
          `SELECT * FROM transaction_product WHERE transaction_id = ${req.params.transaction_id} ORDER BY "id" ASC`
        );
        res.json({ transactionsProduct: rows, totalItem: rowCount });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .post(async function (req, res) {
      try {
        console.log(
          "🚀 ~ file: transaction.js:58 ~ req.params:",
          req.params,
          req.body
        );
        const { rows: newtransactions } = await db.query(
          `INSERT INTO transaction_product ("transaction_id", "product_id", "quantity", "price", "totalprice") VALUES($1,$2,$3,$4,$5) returning *`,
          [
            req.params.transaction_id,
            req.body.product_id,
            req.body.quantity,
            req.body.price,
            req.body.totalprice,
          ]
        );
        res.json({ transaction: newtransactions });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .put(async function (req, res) {
      try {
        const { rows: updatedtransaction } = await db.query(
          `UPDATE transaction SET "customer_id" = $1, "customer_address_id" = $2, "payment_method_id" = $3, "payment_amount" = $4, "transaction_date" = $5 WHERE id = $6 returning *`,
          [
            req.body.customer_id,
            req.body.customer_address_id,
            req.body.payment_method_id,
            req.body.payment_amount,
            req.body.transaction_date,
            req.params.transaction_id,
          ]
        );
        res.json({
          transaction: updatedtransaction,
        });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .delete(async function (req, res) {
      try {
        const { rowCount } = await db.query(
          `DELETE from transaction WHERE id = $1`,
          [req.params.transaction_id]
        );
        res.json({ transaction: rowCount });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    });

  return router;
};
