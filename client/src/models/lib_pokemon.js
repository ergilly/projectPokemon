const PubSub = require('../helpers/pub_sub.js');
const RequestHelper = require('../helpers/request_helper.js');

class LibPokemon {
  constructor(data) {
    this.data = {}
    this.stats
    this.pokemonData = {}
  }

  getData() {
    const url = 'http://localhost:3000/libpokemon';
    const requestHelper = new RequestHelper(url);
    requestHelper.get().then((data) => {
      this.data = data;
      // PubSub.publish('LibPokemon:all-pokemon-ready', data);
    }).then(() => {
      this.getStats();
    })
  }

  getStats() {
    const url = 'http://localhost:3000/libstats';
    const requestHelper = new RequestHelper(url);
    requestHelper.get().then((data) => {
      this.stats = data;
      const info = [data, this.data]
      PubSub.publish('LibPokemon:all-stats-ready', info);
    })
  }


  getPokemon() {
    PubSub.subscribe('LibPokemon:url-ready', (evt) => {
      let url = evt.detail;
      const getPokemon = new RequestHelper(url);
      getPokemon.get().then((data) => {
        this.pokemonData = data;
        PubSub.publish('LibPokemon:specific-pokemon-ready', data)
      })
    })
  }

  postPokemon(poke, stats) {
    const url = `http://localhost:3000/libpokemon`;
    const request = new RequestHelper(url);
    request.post(poke)
      .then(() => {
        request.url = `http://localhost:3000/libstats`
        request.post(stats)
          .then(() => {
        this.getData();
      })
      .catch(console.error);
  })
}




  deletePokemon(pokeId) {
    const url = `http://localhost:3000/libstats/${pokeId}`;
    const request = new RequestHelper(url);
    request.delete(pokeId)
    request.url = `http://localhost:3000/libpokemon/${pokeId}`;
    request.delete(pokeId)
      .then(() => {
        this.getData();
        this.getStats();
      })
      .catch(console.error);
  }

  putStats(stats, pokeId) {
    const url = `http://localhost:3000/libstats/${pokeId}`;
    const request = new RequestHelper(url);
    request.put(stats)
      .then((pokemon) => {
        PubSub.publish('LibPokemon:all-stats-ready', pokemon);
      })
      .catch(console.error);
  }

}


module.exports = LibPokemon;
