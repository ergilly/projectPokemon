const PubSub = require('../helpers/pub_sub.js');
const InvPokemon = require('../models/inv_pokemon.js');

class FormView {
  constructor(element) {
    this.element = element;
  }

  bindEvents() {
    PubSub.subscribe('Pokemon:all-pokemon-ready', (evt) => {
      const pokemonData = evt.detail.results;
      this.element.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const newPokemon = evt.target['name'].value;
        pokemonData.forEach((pokemon) => {
          if (pokemon.name == newPokemon.toLowerCase()) {
            const url = pokemon.url
            PubSub.publish('Pokemon:url-ready', url);
          }
        })
      })

      this.element.reset();
    });

    PubSub.subscribe('InvPokemon:all-pokemon-ready', (event) => {
      const allPokemon = event.detail;
      PubSub.subscribe('InvPokemon:specific-pokemon-ready', (evt) => {
        const data = evt.detail;
        const dontHave = allPokemon.every((poke) => {
          let number = data.id;
          if (number < 10) {
            number = '#00' + number;
          } else if (number < 100) {
            number = '#0' + number;
          } else {
            number = '#' + number;
          }
          if (poke.natno == number) {
            return false
          } else {
            return true
          }
        })

        if (dontHave == true) {
          const newPokemon = this.newPokemon(data);
          const pokemon = new InvPokemon();
          pokemon.postPokemon(newPokemon);
          const newStats = this.newStats(data);
          pokemon.postStats(newStats);
        }

      })

    })

  }

  newPokemon(data) {
    const newPokemon = {};
    newPokemon.name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    if (data.types.length > 1) {
      newPokemon.types = `${data.types[1].type.name}-${data.types[0].type.name}`;
    } else {
      newPokemon.types = data.types[0].type.name;
    }
    newPokemon.height = data.height / 10;
    newPokemon.weight = data.weight / 10;
    let number = data.id;
    if (number < 10) {
      number = '00' + number;
    } else if (number < 100) {
      number = '0' + number;
    }
    newPokemon.natNo = `#${number}`;
    return newPokemon;
  }

  newStats(data) {
    const newStats = {};
    newStats.health = data.stats[5].base_stat;
    newStats.attack = data.stats[4].base_stat;
    newStats.defense = data.stats[3].base_stat;
    newStats.sp_attk = data.stats[2].base_stat;
    newStats.sp_def = data.stats[1].base_stat;
    newStats.speed = data.stats[0].base_stat;
    let number = data.id;
    if (number < 10) {
      number = '00' + number;
    } else if (number < 100) {
      number = '0' + number;
    }
    newStats.owner = `#${number}`;
    console.log(newStats);
    return newStats;

  }



}

module.exports = FormView;
