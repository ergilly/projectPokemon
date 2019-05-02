const PubSub = require('../helpers/pub_sub.js');
const InvPokemon = require('../models/inv_pokemon.js');
const LibPokemon = require('../models/lib_pokemon.js');

class FormView {
  constructor(element) {
    this.element = element;
    this.data;
    this.libData;
  }

  bindEvents() {
    //get information from external api for all pokemon
    PubSub.subscribe('Pokemon:all-pokemon-ready', (evt) => {
      const pokemonData = evt.detail.results;
      this.element.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const newPokemon = evt.target['name-input'].value;
        pokemonData.forEach((pokemon) => {
          if (pokemon.name == newPokemon.toLowerCase()) {
            const url = pokemon.url
            PubSub.publish('Pokemon:url-ready', url);
          }
        })
        this.element.reset();
      })

    });

    //subscribe to inventory pokemon
    PubSub.subscribe('InvPokemon:all-pokemon-ready', (event) => {
      const allPokemon = event.detail;
      this.data = allPokemon;
    })

    //subscribe to library pokemon
    PubSub.subscribe('LibPokemon:all-stats-ready', (event) => {
      const allPokemon = event.detail;
      this.libData = allPokemon;
    })

    PubSub.subscribe('Pokemon:specific-pokemon-ready', (evt) => {
      const data = evt.detail;
      console.log(this.libData);

      //Check against inventory and library to see if the user already has the pokemon
      const dontHaveInv = this.data.every((poke) => {
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
      const dontHaveLib = this.libData[0].every((poke) => {
        let number = data.id;
        if (number < 10) {
          number = '#00' + number;
        } else if (number < 100) {
          number = '#0' + number;
        } else {
          number = '#' + number;
        }

        if (poke.owner == number) {
          return false
        } else {
          return true
        }
      })

      //IF the user doesnt have the pokemon and the inventory has less than 6 pokemon, add new one to inventory
      //IF the inventory already has 6, add the new one to the library
      if (dontHaveInv == true && dontHaveLib == true) {
        if (this.data.length < 6) {
          const newPokemon = this.newPokemon(data);
          const newStats = this.newStats(data);
          const pokemon = new InvPokemon();
          pokemon.postPokemon(newPokemon, newStats);
        } else {
          const newPokemon = this.newPokemon(data);
          const newStats = this.newStats(data);
          const library = new LibPokemon();
          library.postPokemon(newPokemon, newStats);
        }
      } else {
        const cont = document.querySelector('.have-pokemon')
        cont.innerHTML = '';
        const have = document.createElement('h2');
        have.textContent = "You already have this Pokémon";
        cont.appendChild(have);
      }
    })
  }

  // extract data from external api and add it to internal database
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
    newPokemon.natno = `#${number}`;

    let abilitiesArray = '';
    for (var i = (data.abilities.length - 1); i > -1; i--) {
      if (data.abilities[i].is_hidden == true) {
        let ability = `${data.abilities[i].ability.name}-h`
        abilitiesArray += `+${ability}`
      } else {
        let ability = data.abilities[i].ability.name
        abilitiesArray += `+${ability}`
      }
    }
    newPokemon.abilities = abilitiesArray
    return newPokemon;
  }

  // get the pokemons stats from the external api and store them in the internal stats table
  newStats(data) {
    const newStats = {};
    newStats.health = data.stats[5].base_stat;
    newStats.attack = data.stats[4].base_stat;
    newStats.defense = data.stats[3].base_stat;
    newStats.sp_attk = data.stats[2].base_stat;
    newStats.sp_def = data.stats[1].base_stat;
    newStats.speed = data.stats[0].base_stat;
    newStats.level = 1;
    let number = data.id;
    if (number < 10) {
      number = '00' + number;
    } else if (number < 100) {
      number = '0' + number;
    }
    newStats.owner = `#${number}`;
    return newStats;

  }



}

module.exports = FormView;
