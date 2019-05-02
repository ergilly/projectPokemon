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
    this.storedTypes = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
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
        const allGrid = document.querySelector('#grid2-container')
        data.forEach((poke, i) => {


          const newSprite = this.createSprite(i);

          allGrid.appendChild(newSprite);

          let pokeTypes = this.getPokeTypes(poke);

          this.appendSpriteTypes(pokeTypes, newSprite);


        });
      }).then(() => {
        const libPokemon = new LibPokemon();
        libPokemon.getData();
      });
      PubSub.subscribe('LibPokemon:all-stats-ready', (evt) => {
        const pokemonInfo = evt.detail[1];
        const pokemonStat = evt.detail[0]
        this.renderPokemon(pokemonInfo, pokemonStat);
        if (pokemonInfo.length == 151) {
          const cont = document.querySelector('.have-pokemon')
          const haveAllPokemon = document.createElement('h2');
          haveAllPokemon.textContent = "CONGRATULATIONS!!!! You Caught Them All!!!";
          cont.appendChild(haveAllPokemon);
        }
      })

    });
  };



  renderPokemon(pokemon, stats) {
    this.clearPokemon()
    //goes through every pokemon in the users library and calls the lightUpPoke function.
    pokemon.forEach((pokemon) => {
      stats.forEach((poke, i) => {
        if (pokemon.natno == poke.owner) {
          pokemon.stats = poke
          this.lightUpPoke(pokemon);
        }
      })
    })
  }



  lightUpPoke(pokemon) {

    // Highlights the specified pokemon in library
    const natno = pokemon.natno.slice(1);
    const num = (parseInt(natno)) - 1;
    const grid = document.querySelector(`.grid-item-${num}`)
    var _self = this;

    //adds an event listener on each grid item that the user owns the pokemon of to display further info
    grid.addEventListener('click', function onClick() {
        _self.displayPoke(pokemon);
        grid.removeEventListener('click', onClick)
    });
    grid.classList.remove('opaque');

  }
  // clears highlight of all pokemon in container
  clearPokemon() {
    for (var i = 0; i < this.pokemonData.length; i++) {
      const element = document.querySelector(`.grid-item-${i}`)
      element.classList.add('opaque');
    }
  }

  displayPoke(pokemon) {

    //create thumbnail container
    const container = document.querySelector("#grid-1");
    container.innerHTML = '';
    const name = pokemon.name.toLowerCase();
    const thumb = document.createElement('div');
    thumb.classList.add('thumbnail');
    const imgcont = document.createElement('div');
    imgcont.classList.add('imgcont');

    //add image to thumbnail container
    const image = document.createElement('img');
    image.id = 'lib-img';
    image.src = `./images/splash/${name}.jpg`
    image.alt = `https://img.pokemondb.net/artwork/${name}.jpg`
    imgcont.appendChild(image);
    thumb.appendChild(imgcont);
    container.appendChild(thumb);

    //add pokemon name to container
    const info = document.createElement('div');
    info.id = 'info'
    const title = document.createElement('div');
    title.classList.add('h2');
    title.textContent = pokemon.name;

    //add pokemon's current lvl to the container
    const level = document.createElement('p');
    level.id = 'image-card'
    level.textContent = `Lvl ${pokemon.stats.level}`;

    //add the pokemons types to the container
    const displayTypes = document.createElement('div');
    const types = pokemon.types.split('-');
    const type1 = types[0];
    const type2 = types[1];
    if (type2 == undefined) {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span>`
    } else {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span><span class='type-icon type-${type2.toLowerCase()}'>${type2}</span>`;
    }

    //add a button to withdraw a pokemon to my inventory
    const withdraw = document.createElement('button');
    withdraw.id = 'withdraw-button'
    withdraw.classList.add('yellow', 'ui', 'button');
    withdraw.textContent = 'Withdraw'
    withdraw.addEventListener('click', (evt) => {

      //limit number of pokemon in inventory to 6
      const inv = document.querySelector('#pokemon-container');
      if ((inv.getElementsByTagName("div").length/10) < 6) {
        container.innerHTML = '';

        // add pokemon to inventory
        const inventory = new InvPokemon();
        inventory.postPokemon(pokemon, pokemon.stats);

        // remove pokemon from library
        const libPokemon = new LibPokemon();
        libPokemon.deletePokemon(pokemon.id);

        // remove highlight from pokemon thats withdrawn
        const natno = pokemon.natno.slice(1);
        const num = (parseInt(natno)) - 1;
        const grid = document.querySelector(`.grid-item-${num}`)
        grid.classList.add('opaque');
      }
    })


    info.appendChild(title);
    info.appendChild(level);
    info.appendChild(displayTypes);
    info.appendChild(withdraw);
    container.appendChild(info);

  }

  createGrids() {
    const container = document.querySelector('#library-tabs');

    this.storedTypes.forEach((type) => {
      const grid = document.createElement('div');
      grid.id = 'grid2-hidden'
      grid.classList.add(`grid-${type}`);
      container.appendChild(grid);
    })
  }

  getPokeTypes(poke) {
    let pokeTypes = []
    for (let type of poke.types) {
      pokeTypes.push(type.type.name);
    }
    return pokeTypes
  }

  appendSpriteTypes(pokeTypes, newSprite) {
    this.storedTypes.forEach((type) => {
      if (pokeTypes[0] == type || pokeTypes[1] == type) {
        const gridType = document.querySelector(`.grid-${type}`);
        // gridType.appendChild(newSprite);
      }
    })

  }

  createSprite(i) {
    const newSprite = document.createElement('img')
    newSprite.src = `../images/sprite/${i+1}.png`;
    newSprite.alt = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i+1}.png`
    newSprite.id = 'grid-item'
    newSprite.classList.add('opaque', `grid-item-${i}`);
    return newSprite;
  }
}


// var onClick = function (event) {
//   this.displayPoke(pokemon);
// };
//



module.exports = LibView;
