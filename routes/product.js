var express = require("express");
var router = express.Router();

/* GET users listing. */

module.exports = function (db) {
  router
    .route("/")
    .get(async function (req, res) {
      try {
        const { rows, rowCount } = await db.query(
          `SELECT * FROM product ORDER BY "id" ASC`
        );
        res.json({ products: rows, totalproduct: rowCount });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .post(async function (req, res) {
      try {
        const { rows: newproducts } = await db.query(
          `INSERT INTO product ("name", "price") VALUES($1, $2) returning *`,
          [req.body.name, req.body.price]
        );
        res.json({ product: newproducts });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    });

  router
    .route("/:product_id")
    .put(async function (req, res) {
      try {
        const { rows: updatedproduct } = await db.query(
          `UPDATE product SET "name" = $1, "price" = $2 WHERE id = $3 returning *`,
          [req.body.name, req.body.price, req.params.product_id]
        );
        res.json({
          product: updatedproduct,
        });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    })
    .delete(async function (req, res) {
      try {
        const { rowCount } = await db.query(
          `DELETE from product WHERE id = $1`,
          [req.params.product_id]
        );
        res.json({ product: rowCount });
      } catch (error) {
        console.log("Error occured", error);
        res.json({ error });
      }
    });

  return router;
};
