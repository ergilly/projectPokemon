var express = require('express');
var router = express.Router();
const SqlRunner = require('../db/sql_runner.js');

// GET users listing. READ
router.get('/', function(req, res, next) {
  SqlRunner.run("SELECT * FROM libstats ORDER BY id ASC").then(
    result => {
      res.status(200).json(result.rows);
    });
});

// Make new pokemon. CREATE
router.post('/', function(req, res) {
  SqlRunner.run("INSERT INTO libstats (health, attack, defense, sp_attk, sp_def, speed, level, owner) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [req.body.health, req.body.attack, req.body.defense, req.body.sp_attk, req.body.sp_def, req.body.speed, req.body.level, req.body.owner]).then(result => {
    SqlRunner.run("SELECT * FROM libstats ORDER BY id ASC")
      .then((result) => {
        res.status(201).json(result.rows);
      });
  });
});

// GET a single pokemon. READ
router.get('/:id', function(req, res) {
  SqlRunner.run("SELECT * FROM libstats WHERE owner = $1", [req.params.owner]).then(
    result => {
      res.status(200).json(result.rows);
    });
});

// update pokemon information. UPDATE
router.put('/:id', function(req, res) {
  SqlRunner.run("UPDATE libstats SET health = $1, attack = $2, defense = $3, sp_attk = $4, sp_def = $5, speed = $6, level = $7 WHERE id = $8", [req.body.health, req.body.attack, req.body.defense, req.body.sp_attk, req.body.sp_def, req.body.speed, req.body.level, req.params.id]).then(result => {
    SqlRunner.run("SELECT * FROM libstats ORDER BY id ASC")
      .then((result) => {
        res.status(201).json(result.rows);
      });
  });
});

// remove a pokemon. DELETE
router.delete('/:id', function(req, res) {
  SqlRunner.run("DELETE FROM libstats WHERE id = $1", [req.params.id]).then(
    result => {
      res.status(201).json(result);
    });
});

module.exports = router;
