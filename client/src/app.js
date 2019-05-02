const Pokemon = require('./models/pokemon.js');
const FormView = require('./views/form_view.js');
const InvPokemon = require('./models/inv_pokemon.js');
const InventoryView = require('./views/inventory_view.js');
const PokeView = require('./views/poke_view.js');
const LibView = require('./views/library_view.js');
const LibPokemon = require('./models/lib_pokemon.js');
const EvoView = require('./views/evolution_view.js');

document.addEventListener('DOMContentLoaded', () => {
  console.log("jsLoaded");

  const formElement = document.querySelector('#pokemon-form');
  const formView = new FormView(formElement);
  formView.bindEvents();

  const pokemonContainer = document.querySelector('#pokemon-container');
  const inventoryView = new InventoryView(pokemonContainer);
  inventoryView.bindEvents();

  const libContainer = document.querySelector('#library');
  const libView = new LibView(libContainer);
  libView.createGrids()
  libView.bindEvents();

  const invPokemon = new InvPokemon();
  invPokemon.getData();
  invPokemon.getPokemon();

  const evoView = new EvoView();
  evoView.bindEvents();

  const pokemon = new Pokemon();
  pokemon.getData();
  pokemon.getPokemon();



})
