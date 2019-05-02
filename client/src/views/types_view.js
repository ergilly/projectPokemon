const PubSub = require('../helpers/pub_sub.js');
const Pokemon = require('../models/pokemon.js');
const RequestHelper = require('../helpers/request_helper.js');
const LibPokemon = require('../models/lib_pokemon.js');
const InvPokemon = require('../models/inv_pokemon.js');

class LibView {
  constructor(container) {
    this.container = container
    this.pokemonData = {}
    this.pokemonInfo;

  }

  bindEvents() {

    PubSub.subscribe('Pokemon:all-pokemon-ready', (evt) => {
      const pokemonData = evt.detail.results;
      const promiseArray = [];
      pokemonData.forEach((pokemon) => {

        let url = pokemon.url;
        const getPokemon = new RequestHelper(url);
        const promise = getPokemon.get()
        promiseArray.push(promise);
      });
      Promise.all(promiseArray).then((data) => {
        // For every pokemon from external API i am taking their name and sprite to populate the library
        data.forEach((poke, i) => {
          const newSprite = document.createElement('img')
          newSprite.src = `../images/sprite/${i+1}.png`;
          newSprite.alt = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i+1}.png`
          newSprite.id = 'grid-item'
          newSprite.classList.add('opaque', `grid-item-${i}`);

          const container = document.querySelector('.library-tabs');

          const grid = document.createElement('div');
          grid.id = 'grid2-container'
          container.appendChild(grid);
          grid.appendChild(newSprite);

          this.types.forEach((type) => {
            const grid = document.createElement('div');
            grid.id = 'grid2-hidden'
            grid.classList.add(`grid-${type}`);
            container.appendChild(grid);
          })

          pokeTypes = []
          for (type of poke.types) {
            pokeTypes.push(type.type.name);
          }

          this.types.forEach((type) => {
            if (pokeTypes[0] == type || pokeTypes[1] == type) {
              const gridType = document.querySelector(`.grid-${type}`);
              gridType.appendChild(newSprite);
            }
          })

        });
      }).then(() => {
        const libPokemon = new LibPokemon();
        libPokemon.getData();
      });
    })
  }

  showDefaultGrid() {

  }

  populateTypeGrid(type, newSprite) {

  }
