var express = require('express');
var router = express.Router();
const SqlRunner = require('../db/sql_runner.js');

// GET users listing. READ
router.get('/', function(req, res, next) {
  SqlRunner.run("SELECT * FROM libpokemon ORDER BY id ASC").then(
    result => {
      res.status(200).json(result.rows);
    });
});

// Make new libpokemon. CREATE
router.post('/', function(req, res) {
  SqlRunner.run("INSERT INTO libpokemon (natno, name, types, height, weight, abilities) VALUES ($1, $2, $3, $4, $5, $6)", [req.body.natno, req.body.name, req.body.types, req.body.height, req.body.weight, req.body.abilities]).then(result => {
    SqlRunner.run("SELECT * FROM libpokemon ORDER BY id ASC")
      .then((result) => {
        res.status(201).json(result.rows);
      });
  });
});

// GET a single libpokemon. READ
router.get('/:id', function(req, res) {
  SqlRunner.run("SELECT * FROM libpokemon WHERE id = $1", [req.params.id]).then(
    result => {
      res.status(200).json(result.rows);
    });
});

// update libpokemon information. UPDATE
router.put('/:id', function(req, res) {
  SqlRunner.run("UPDATE libpokemon SET natNo = $1, name = $2, types = $3, height = $4, weight = $5, abilities = $6, WHERE id = $7", [req.body.natNo, req.body.name, req.body.types, req.body.height, req.body.weight, req.body.abilities, req.params.id]).then(result => {
    SqlRunner.run("SELECT * FROM libpokemon ORDER BY id ASC")
      .then((result) => {
        res.status(201).json(result.rows);
      });
  });
});

// remove a libpokemon. DELETE
router.delete('/:id', function(req, res) {
  SqlRunner.run("DELETE FROM libpokemon WHERE id = $1", [req.params.id]).then(
    result => {
      res.status(201).json(result);
    });
});

module.exports = router;
