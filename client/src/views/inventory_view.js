const PubSub = require('../helpers/pub_sub.js');
const InvPokemon = require('../models/inv_pokemon.js');

class InventoryView {
  constructor(container) {
    this.container = container;
  }

  bindEvents() {
    PubSub.subscribe('InvPokemon:all-pokemon-ready', (evt) => {
      const pokemonInv = evt.detail;
      PubSub.subscribe('InvPokemon:all-stats-ready', (event) => {
        const pokemonStat = event.detail
        pokemonInv.forEach((pokemon) => {
          pokemonStat.forEach((poke) => {
            if (pokemon.natno == poke.owner) {
              pokemon.stats = poke
              this.displayPokemon(pokemon);
            }
          })
        })
      })
      // this.renderPokemon(pokemon);
    });
  }

  diplayPokemon(pokemon) {

  }
}
module.exports = InventoryView;
