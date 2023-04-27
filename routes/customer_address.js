var express = require("express");
var router = express.Router();

/* GET users listing. */

module.exports = function (db) {
  router
    .route("/")
    .get(async function (req, res) {
      try {
        const { rows, rowCount } = await db.query(
          `SELECT * FROM customer_address ORDER BY "id" ASC`
        );
        res.json({ customer_address: rows, totalAddress: rowCount });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .post(async function (req, res) {
      try {
        const { rows: newAddress } = await db.query(
          `INSERT INTO customer_address ("customer_id", "address") VALUES($1, $2) returning *`,
          [req.body.customer_id, req.body.address]
        );
        res.json({ customer_address: newAddress });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    });

  router
    .route("/:address_id")
    .put(async function (req, res) {
      try {
        const { rows: updatedAddress } = await db.query(
          `UPDATE customer_address SET "customer_id" = $1, "address" = $2  WHERE id = $3 returning *`,
          [req.body.customer_id, req.body.address, req.params.address_id]
        );
        res.json({
          customer_address: updatedAddress,
        });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .delete(async function (req, res) {
      try {
        const { rowCount } = await db.query(
          `DELETE from customer_address WHERE id = $1`,
          [req.params.address_id]
        );
        res.json({ customer_address: rowCount });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    });

  return router;
};
