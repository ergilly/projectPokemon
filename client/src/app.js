const Pokemon = require('./models/pokemon.js');
const FormView = require('./views/form_view.js');
const InvPokemon = require('./models/inv_pokemon.js');
const InventoryView = require('./views/inventory_view.js');

document.addEventListener('DOMContentLoaded', () => {
  console.log("jsLoaded");
  const invPokemon = new InvPokemon();
  invPokemon.getData();
  invPokemon.getStats();
  invPokemon.getPokemon();

  const formElement = document.querySelector('#pokemon-form');
  const formView = new FormView(formElement);
  formView.bindEvents();

  const pokemonContainer = document.querySelector('#pokemon-container');
  const inventoryView = new InventoryView(pokemonContainer);
  inventoryView.bindEvents();

  const pokemon = new Pokemon();
  pokemon.getData();
  pokemon.getPokemon();



})
