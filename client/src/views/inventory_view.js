const PubSub = require('../helpers/pub_sub.js');
const InvPokemon = require('../models/inv_pokemon.js');
const PokeView = require('./poke_view.js');
const LibPokemon = require('../models/lib_pokemon.js');
const EvoView = require('./evolution_view.js');

class InventoryView {
  constructor(container) {
    this.container = container;
    this.data;
  }

  bindEvents() {
    //get data of pokemon in the users inventory
    PubSub.subscribe('InvPokemon:all-pokemon-ready', (evt) => {
      const pokemonInv = evt.detail;
      PubSub.subscribe('InvPokemon:all-stats-ready', (event) => {
        const pokemonStat = event.detail
        this.renderPokemon(pokemonInv, pokemonStat);
      })
    });

    //get data to populate evolution view as this will be called from this view
    PubSub.subscribe('EvoView:all-pokemon-ready', (evt) => {
      this.data = evt.detail;
    })
  }

  renderPokemon(pokemon, stats) {
    //clear cards container
    this.clearPokemon();
    //for every pokemon in the user's inventory, display a card
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

    //create the elements for a card
    const card = document.createElement('div');
    card.id = 'card-width';
    card.classList.add('ui', 'card');

    //add height and weight to the card
    const displayHW = document.createElement('div');
    displayHW.classList.add('meta');
    displayHW.innerHTML = `<span>Height: ${pokemon.height} | Weight: ${pokemon.weight}</span>`;

    //add pokemon's name to the card
    const displayName = document.createElement('div');
    displayName.classList.add("header");
    displayName.innerHTML = `${pokemon.name}`;

    //add pokemon's types to the card
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

    // add an image of the pokemon to the card
    const sprite = document.createElement('img');
    const urlInput = pokemon.name.toLowerCase();
    sprite.src = `./images/splash/${urlInput}.jpg`;
    sprite.alt = `https://img.pokemondb.net/artwork/${urlInput}.jpg`
    sprite.classList.add('right', 'floated', 'pic-size', 'ui', 'image');

    //make the card clickable to display further information from the PokeView view
    const content = document.createElement('div');
    content.classList.add("content");
    if (types.length == 1) {
      content.classList.add(`back-${types[0]}`);
    } else {
      const colour1 = this.createColour(types[0]);
      const colour2 = this.createColour(types[1]);
      const style = document.createElement('style');
      style.innerHTML = `.gradient${pokemon.id} { background-image: linear-gradient(to right,${colour1},${colour2})!important; }`;
      content.appendChild(style);

      content.classList.add(`gradient${pokemon.id}`);
    }
    content.value = pokemon;
    content.addEventListener('click', (evt) => {
      const pokedexData = document.querySelector('#pokedex-data');
      const pokeView = new PokeView(pokedexData);
      pokeView.renderView(pokemon, this.data);
    });

    //add extra content to the bottom of the card (3 buttons, release, lvl up and store)
    const extraContent = document.createElement('div');
    extraContent.classList.add('extra', 'content');
    const threeButtons = document.createElement('div');
    threeButtons.classList.add('ui', 'three', 'buttons');

    // add a button to 'release' the pokemon and delete it from the users inventory table
    const deletePoke = document.createElement('div');
    deletePoke.classList.add('ui', 'red', 'button');
    deletePoke.textContent = 'Release'
    deletePoke.value = pokemon.id;
    deletePoke.addEventListener('click', (evt) => {
      const pokeId = evt.target.value;
      const invPokemon = new InvPokemon();
      invPokemon.deletePokemon(pokeId);

      // clear the further information
      const pokedexData = document.querySelector('#pokedex-data');
      const pokeView = new PokeView(pokedexData);
      pokeView.clearView();

      // clear the evolution information
      const evoData = document.querySelector('#evolution-data');
      const evoView = new EvoView(evoData);
      evoView.clearView();
    })

    //create a button to increase the chosen pokemons level
    const lvlUp = document.createElement('div');
    lvlUp.classList.add('ui', 'green', 'button');
    lvlUp.textContent = 'Lvl Up'
    lvlUp.value = [pokemon.stats.id, pokemon.stats.health, pokemon.stats.attack, pokemon.stats.defense, pokemon.stats.sp_attk, pokemon.stats.sp_def, pokemon.stats.speed, pokemon.stats.level];
    lvlUp.addEventListener('click', (evt) => {
      //limit max level to 99
      if (evt.target.value[7] < 100) {
        const pokeId = evt.target.value[0]
        //update the stats for each level increasing by 2%
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
        this.updatePokedex(updatedStats, pokemon);
      }


    });


    //create a button to move pokemon from users inventory to their library
    const store = document.createElement('div');
    store.classList.add('ui', 'yellow', 'button');
    store.textContent = 'Store Poke'
    store.addEventListener('click', (evt) => {

      //add the pokemon to the users library
      const library = new LibPokemon();
      library.postPokemon(pokemon, pokemon.stats);

      //remove pokemon from the users inventory
      const invPokemon = new InvPokemon();
      invPokemon.deletePokemon(pokemon.id);

      // clear the further information
      const pokedexData = document.querySelector('#pokedex-data');
      const pokeView = new PokeView(pokedexData);
      pokeView.clearView();

      // clear the evolution information
      const evoData = document.querySelector('#evolution-data');
      const evoView = new EvoView(evoData);
      evoView.clearView();
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

  //update pokedex information
  updatePokedex(updatedStats, pokemon) {
    const pokedexData = document.querySelector('#pokedex-data');
    const pokeView = new PokeView(pokedexData);
    pokemon.stats = updatedStats;
    pokeView.renderView(pokemon, this.data);
  }

  createColour(type) {
    let colour = ''
    if (type == 'normal') {
      colour = 'rgba(170,170,153,0.5)'
    } else if (type == 'fire') {
      colour = 'rgba(255,68,34,0.5)'
    } else if (type == 'water') {
      colour = 'rgba(51,153,255,0.5)'
    } else if (type == 'electric') {
      colour = 'rgba(255,204,51,0.5)'
    } else if (type == 'grass') {
      colour = 'rgba(119,204,85,0.5)'
    } else if (type == 'ice') {
      colour = 'rgba(102,204,255,0.5)'
    } else if (type == 'fighting') {
      colour = 'rgba(187,85,68,0.5)'
    } else if (type == 'poison') {
      colour = 'rgba(170,85,153,0.5)'
    } else if (type == 'ground') {
      colour = 'rgba(221,187,85,0.5)'
    } else if (type == 'flying') {
      colour = 'rgba(136,153,255,0.5)'
    } else if (type == 'psychic') {
      colour = 'rgba(255,85,153,0.5)'
    } else if (type == 'bug') {
      colour = 'rgba(170,187,34,0.5)'
    } else if (type == 'rock') {
      colour = 'rgba(187,170,102,0.5)'
    } else if (type == 'ghost') {
      colour = 'rgba(102,102,187,0.5)'
    } else if (type == 'dragon') {
      colour = 'rgba(120,103,238,0.5)'
    } else if (type == 'dark') {
      colour = 'rgba(119,85,68,0.5)'
    } else if (type == 'steel') {
      colour = 'rgba(171,171,187,0.5)'
    } else if (type == 'fairy') {
      colour = 'rgba(238,154,238,0.5)'
    }
    return colour
  }
}
module.exports = InventoryView;
