const PubSub = require('../helpers/pub_sub.js');
const RequestHelper = require('../helpers/request_helper.js');

class Pokemon {
  constructor(data) {
    this.data = {}
    this.pokemonData = {}
  }

  getData() {
    const url = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151';
    const requestHelper = new RequestHelper(url);
    requestHelper.get().then((data) => {
      this.data = data;
      PubSub.publish('Pokemon:all-pokemon-ready', data);
    })
  }

  getPokemon() {
    PubSub.subscribe('Pokemon:url-ready', (evt) => {
      let url = evt.detail;
      const getPokemon = new RequestHelper(url);
      getPokemon.get().then((data) => {
        this.pokemonData = data;
        PubSub.publish('Pokemon:specific-pokemon-ready', data)
      })
    })
  }




}


module.exports = Pokemon;
