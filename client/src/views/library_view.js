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
        data.forEach((poke, i) => {
          const newSprite = document.createElement('img')
          newSprite.src = `../images/sprite/${i+1}.png`;
          newSprite.alt = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i+1}.png`
          newSprite.id = 'grid-item'
          newSprite.classList.add('opaque', `grid-item-${i}`);
          const grid = document.querySelector('#grid2-container');
          grid.appendChild(newSprite);
        });


      }).then(() => {
        const libPokemon = new LibPokemon();
        libPokemon.getData();
      });

      PubSub.subscribe('LibPokemon:all-stats-ready', (evt) => {
        const pokemonInfo = evt.detail[1];
        const pokemonStat = evt.detail[0]
        this.renderPokemon(pokemonInfo, pokemonStat);
      })



    });
  };



  renderPokemon(pokemon, stats) {
    this.clearPokemon()

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
    const natno = pokemon.natno.slice(1);
    const num = (parseInt(natno)) - 1;
    const grid = document.querySelector(`.grid-item-${num}`)
    var _self = this;

    grid.addEventListener('click', function onClick() {
        _self.displayPoke(pokemon);
        grid.removeEventListener('click', onClick)
    });

    grid.classList.remove('opaque');

  }

  clearPokemon() {
    for (var i = 0; i < this.pokemonData.length; i++) {
      const element = document.querySelector(`.grid-item-${i}`)
      element.classList.add('opaque');
    }
  }

  displayPoke(pokemon) {
    const container = document.querySelector("#grid-1");
    container.innerHTML = '';
    const name = pokemon.name.toLowerCase();
    const thumb = document.createElement('div');
    thumb.classList.add('thumbnail');
    const imgcont = document.createElement('div');
    imgcont.classList.add('imgcont');

    const image = document.createElement('img');
    image.id = 'lib-img';
    image.src = `./images/splash/${name}.jpg`
    image.alt = `https://img.pokemondb.net/artwork/${name}.jpg`
    imgcont.appendChild(image);
    thumb.appendChild(imgcont);
    container.appendChild(thumb);

    const info = document.createElement('div');
    info.id = 'info'
    const title = document.createElement('div');
    title.classList.add('h2');
    title.textContent = pokemon.name;

    const level = document.createElement('p');
    level.id = 'image-card'
    level.textContent = `Lvl ${pokemon.stats.level}`;

    const displayTypes = document.createElement('div');
    const types = pokemon.types.split('-');
    const type1 = types[0];
    const type2 = types[1];
    if (type2 == undefined) {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span>`
    } else {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span><span class='type-icon type-${type2.toLowerCase()}'>${type2}</span>`;
    }

    const withdraw = document.createElement('button');
    withdraw.id = 'withdraw-button'
    withdraw.classList.add('yellow', 'ui', 'button');
    withdraw.textContent = 'Withdraw'
    withdraw.addEventListener('click', (evt) => {

      const inv = document.querySelector('#pokemon-container');
      if ((inv.getElementsByTagName("div").length/10) < 6) {
        container.innerHTML = '';

        const inventory = new InvPokemon();
        inventory.postPokemon(pokemon, pokemon.stats);

        const libPokemon = new LibPokemon();
        libPokemon.deletePokemon(pokemon.id);

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
}


// var onClick = function (event) {
//   this.displayPoke(pokemon);
// };
//



module.exports = LibView;
