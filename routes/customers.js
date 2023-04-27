var express = require("express");
var router = express.Router();

/* GET users listing. */

module.exports = function (db) {
  router
    .route("/")
    .get(async function (req, res) {
      try {
        const { rows, rowCount } = await db.query(
          `SELECT * FROM customer ORDER BY "id" ASC`
        );
        res.json({ customers: rows, totalCustomer: rowCount });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .post(async function (req, res) {
      try {
        const { rows: newCustomers } = await db.query(
          `INSERT INTO customer ("name") VALUES($1) returning *`,
          [req.body.name]
        );
        res.json({ customer: newCustomers });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    });

  router
    .route("/:id")
    .put(async function (req, res) {
      try {
        const { rows: updatedCustomer } = await db.query(
          `UPDATE customer SET "name" = $1 WHERE id = $2 returning *`,
          [req.body.name, req.params.id]
        );
        res.json({
          customer: updatedCustomer,
        });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .delete(async function (req, res) {
      try {
        const { rowCount } = await db.query(
          `DELETE from customer WHERE id = $1`,
          [req.params.id]
        );
        res.json({ customer: rowCount });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    });

  return router;
};
