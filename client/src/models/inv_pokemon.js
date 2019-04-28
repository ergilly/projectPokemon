const PubSub = require('../helpers/pub_sub.js');
const RequestHelper = require('../helpers/request_helper.js');

class InvPokemon {
  constructor(data) {
    this.data = {}
    this.pokemonData = {}
  }

  getData() {
    const url = 'http://localhost:3000/pokemon';
    const requestHelper = new RequestHelper(url);
    requestHelper.get().then((data) => {
      this.data = data;
      PubSub.publish('InvPokemon:all-pokemon-ready', data);
    })
  }

  getStats() {
    const url = 'http://localhost:3000/stats';
    const requestHelper = new RequestHelper(url);
    requestHelper.get().then((data) => {
      this.data = data;
      PubSub.publish('InvPokemon:all-stats-ready', data);
    })
  }


  getPokemon() {
    PubSub.subscribe('Pokemon:url-ready', (evt) => {
      let url = evt.detail;
      const getPokemon = new RequestHelper(url);
      getPokemon.get().then((data) => {
        this.pokemonData = data;
        PubSub.publish('InvPokemon:specific-pokemon-ready', data)
      })
    })
  }

  postPokemon(poke) {
    const url = `http://localhost:3000/pokemon`;
    const request = new RequestHelper(url);
    request.post(poke)
      .then((pokemon) => {
        PubSub.publish('InvPokemon:pokemon-data-loaded', pokemon);
      })
      .catch(console.error);
  }

  postStats(stats) {
    const url = `http://localhost:3000/stats`;
    const request = new RequestHelper(url);
    request.post(stats)
      .then((stat) => {
        PubSub.publish('InvPokemon:stats-data-loaded', stat);
      })
      .catch(console.error);
  }
}


module.exports = InvPokemon;
