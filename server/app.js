var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
const cors = require('cors');

var indexRouter = require('./routes/index');
var pokemonRouter = require('./routes/pokemon');
const statsRouter = require('./routes/stats');
var libPokemonRouter = require('./routes/libpokemon');
const libStatsRouter = require('./routes/libstats');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/pokemon', pokemonRouter);
app.use('/stats', statsRouter);
app.use('/libpokemon', libPokemonRouter);
app.use('/libstats', libStatsRouter);

module.exports = app;
