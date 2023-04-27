var express = require("express");
var router = express.Router();

/* GET users listing. */

module.exports = function (db) {
  router
    .route("/")
    .get(async function (req, res) {
      try {
        const { rows, rowCount } = await db.query(
          `SELECT * FROM payment_method ORDER BY "id" ASC`
        );
        res.json({ payment_methods: rows, totalpayment_method: rowCount });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .post(async function (req, res) {
      try {
        const { rows: newpayment_methods } = await db.query(
          `INSERT INTO payment_method ("name", "is_active") VALUES($1, $2) returning *`,
          [req.body.name, req.body.is_active]
        );
        res.json({ payment_method: newpayment_methods });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    });

  router
    .route("/:payment_method_id")
    .put(async function (req, res) {
      try {
        const { rows: updatedpayment_method } = await db.query(
          `UPDATE payment_method SET "name" = $1, "is_active" = $2 WHERE id = $3 returning *`,
          [req.body.name, req.params.payment_method_id]
        );
        res.json({
          payment_method: updatedpayment_method,
        });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .delete(async function (req, res) {
      try {
        const { rowCount } = await db.query(
          `DELETE from payment_method WHERE id = $1`,
          [req.params.payment_method_id]
        );
        res.json({ payment_method: rowCount });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    });

  return router;
};
