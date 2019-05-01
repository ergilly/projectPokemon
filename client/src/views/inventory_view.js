const PubSub = require('../helpers/pub_sub.js');
const InvPokemon = require('../models/inv_pokemon.js');
const PokeView = require('./poke_view.js');
const LibPokemon = require('../models/lib_pokemon.js');

class InventoryView {
  constructor(container) {
    this.container = container;
    this.data;
  }

  bindEvents() {
    PubSub.subscribe('InvPokemon:all-pokemon-ready', (evt) => {
      const pokemonInv = evt.detail;
      PubSub.subscribe('InvPokemon:all-stats-ready', (event) => {
        const pokemonStat = event.detail
        this.renderPokemon(pokemonInv, pokemonStat);
      })
      // this.renderPokemon(pokemon);
    });

    PubSub.subscribe('EvoView:all-pokemon-ready', (evt) => {
      this.data = evt.detail;
    })

  }



  renderPokemon(pokemon, stats) {
    this.clearPokemon();

    pokemon.forEach((pokemon) => {
      stats.forEach((poke) => {
        if (pokemon.natno == poke.owner) {
          pokemon.stats = poke
          const card = this.displayPokemon(pokemon);
          this.container.appendChild(card);
        }
      })
    })
  }
  clearPokemon() {
    this.container.innerHTML = '';
  }

  displayPokemon(pokemon) {
    const card = document.createElement('div');
    card.id = 'card-width';
    card.classList.add('ui', 'card');

    const displayHW = document.createElement('div');
    displayHW.classList.add('meta');
    displayHW.innerHTML = `<span>Height: ${pokemon.height} | Weight: ${pokemon.weight}</span>`;

    const displayName = document.createElement('div');
    displayName.classList.add("header");
    displayName.innerHTML = `${pokemon.name}`;

    const displayTypes = document.createElement('div');
    displayTypes.classList.add('meta');
    const types = pokemon.types.split('-');
    const type1 = types[0];
    const type2 = types[1];
    if (type2 == undefined) {
      displayTypes.innerHTML = `<span>Types: <span class='type-icon type-${type1.toLowerCase()}'>${type1}</span></span>`
    } else {
      displayTypes.innerHTML = `<span>Types: <span class='type-icon type-${type1.toLowerCase()}'>${type1}</span><span class='type-icon type-${type2.toLowerCase()}'>${type2}</span></span>`;
    }

    const sprite = document.createElement('img');
    const urlInput = pokemon.name.toLowerCase();
    sprite.src = `https://img.pokemondb.net/artwork/${urlInput}.jpg`;
    sprite.classList.add('right', 'floated', 'pic-size', 'ui', 'image');

    const content = document.createElement('div');
    content.classList.add("content");
    content.value = pokemon;
    content.addEventListener('click', (evt) => {
      const pokedexData = document.querySelector('#pokedex-data');
      const pokeView = new PokeView(pokedexData);
      pokeView.renderView(pokemon, this.data);
    });

    const extraContent = document.createElement('div');
    extraContent.classList.add('extra', 'content');

    const threeButtons = document.createElement('div');
    threeButtons.classList.add('ui', 'three', 'buttons');

    const deletePoke = document.createElement('div');
    deletePoke.classList.add('ui', 'red', 'button');
    deletePoke.textContent = 'Release'
    deletePoke.value = pokemon.id;
    deletePoke.addEventListener('click', (evt) => {
      const pokeId = evt.target.value;
      const invPokemon = new InvPokemon();
      invPokemon.deletePokemon(pokeId);

      const pokedexData = document.querySelector('#pokedex-data');
      const pokeView = new PokeView(pokedexData);
      pokeView.clearView();
    })

    const lvlUp = document.createElement('div');
    lvlUp.classList.add('ui', 'green', 'button');
    lvlUp.textContent = 'Lvl Up'
    lvlUp.value = [pokemon.stats.id, pokemon.stats.health, pokemon.stats.attack, pokemon.stats.defense, pokemon.stats.sp_attk, pokemon.stats.sp_def, pokemon.stats.speed, pokemon.stats.level];
    lvlUp.addEventListener('click', (evt) => {
      if (evt.target.value[7] < 100) {
        const pokeId = evt.target.value[0]
        const updatedStats = {};
        updatedStats.health = Math.round(evt.target.value[1] * 1.02);
        updatedStats.attack = Math.round(evt.target.value[2] * 1.02);
        updatedStats.defense = Math.round(evt.target.value[3] * 1.02);
        updatedStats.sp_attk = Math.round(evt.target.value[4] * 1.02);
        updatedStats.sp_def = Math.round(evt.target.value[5] * 1.02);
        updatedStats.speed = Math.round(evt.target.value[6] * 1.02);
        updatedStats.level = (evt.target.value[7] + 1);

        const invPokemon = new InvPokemon();
        invPokemon.putStats(updatedStats, pokeId);

        const pokedexData = document.querySelector('#pokedex-data');
        const pokeView = new PokeView(pokedexData);
        pokeView.renderView(pokemon);
      }


    });

    const store = document.createElement('div');
    store.classList.add('ui', 'yellow', 'button');
    store.textContent = 'Store Poke'
    store.addEventListener('click', (evt) => {
      const library = new LibPokemon();
      library.postPokemon(pokemon, pokemon.stats);

      const invPokemon = new InvPokemon();
      invPokemon.deletePokemon(pokemon.id);

      const pokedexData = document.querySelector('#pokedex-data');
      const pokeView = new PokeView(pokedexData);
      pokeView.clearView();
    })


    content.appendChild(sprite);
    content.appendChild(displayName);
    content.appendChild(displayTypes);
    content.appendChild(displayHW);
    threeButtons.appendChild(deletePoke);
    threeButtons.appendChild(lvlUp);
    threeButtons.appendChild(store);
    extraContent.appendChild(threeButtons);
    card.appendChild(content);
    card.appendChild(extraContent);
    return card;
  }
}
module.exports = InventoryView;
