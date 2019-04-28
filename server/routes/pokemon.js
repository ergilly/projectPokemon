var express = require('express');
var router = express.Router();
const SqlRunner = require('../db/sql_runner.js');

// GET users listing. READ
router.get('/', function(req, res, next) {
  SqlRunner.run("SELECT * FROM pokemon ORDER BY id ASC").then(
    result => {
      res.status(200).json(result.rows);
    });
});

// Make new pokemon. CREATE
router.post('/', function(req, res) {
  SqlRunner.run("INSERT INTO pokemon (natNo, name, types, height, weight) VALUES ($1, $2, $3, $4, $5)", [req.body.natNo, req.body.name, req.body.types, req.body.height, req.body.weight]).then(result => {
    SqlRunner.run("SELECT * FROM pokemon ORDER BY id ASC")
      .then((result) => {
        res.status(201).json(result.rows);
      });
  });
});

// GET a single pokemon. READ
router.get('/:id', function(req, res) {
  SqlRunner.run("SELECT * FROM pokemon WHERE id = $1", [req.params.id]).then(
    result => {
      res.status(200).json(result.rows);
    });
});

// update pokemon information. UPDATE
router.put('/:id', function(req, res) {
  SqlRunner.run("UPDATE pokemon SET natNo = $1, name = $2, types = $3, height = $4, weight = $5 WHERE id = $6", [req.body.natNo, req.body.name, req.body.types, req.body.height, req.body.weight, req.params.id]).then(result => {
    SqlRunner.run("SELECT * FROM pokemon ORDER BY id ASC")
      .then((result) => {
        res.status(201).json(result.rows);
      });
  });
});

// remove a pokemon. DELETE
router.delete('/:id', function(req, res) {
  SqlRunner.run("DELETE FROM pokemon WHERE id = $1", [req.params.id]).then(
    result => {
      res.status(201).json(result);
    });
});

module.exports = router;
