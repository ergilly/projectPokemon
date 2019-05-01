const PubSub = require('../helpers/pub_sub.js');
const RequestHelper = require('../helpers/request_helper.js');


class EvoView {
  constructor(container) {
    this.container = container
    this.allPokeData = []
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
          const pokemon = {};
          pokemon.id = poke.id
          pokemon.name = poke.name
          pokemon.types = []
          if (poke.types.length == 2) {
            const type1 = poke.types[1].type.name
            const type2 = poke.types[0].type.name
            pokemon.types.push(type1)
            pokemon.types.push(type2)
          } else {
            const type2 = poke.types[0].type.name
            pokemon.types.push(type2)
          }
          pokemon.imageurl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`
          this.allPokeData.push(pokemon);
        });
      }).then(() => {
        PubSub.publish('EvoView:all-pokemon-ready', this.allPokeData);
      });
    })
  }

  renderView(pokemon, allPokeData) {
    const natno = pokemon.natno.slice(1);
    const num = (parseInt(natno));
    let url = `https://pokeapi.co/api/v2/pokemon-species/${num}/`;
    const requestHelper = new RequestHelper(url);
    requestHelper.get().then((data) => {
      requestHelper.url = data.evolution_chain.url;
      requestHelper.get().then((data) => {
        this.renderEvo(data, pokemon, allPokeData);
      })
    })


  }

  renderEvo(evoData, pokemon, allPokeData) {
    this.container.innerHTML = ''

    console.log(allPokeData);
    console.log(evoData);
    console.log(pokemon);

    console.log(evoData.chain.species.name);
    console.log(evoData.chain.evolves_to.length);
    console.log(evoData.chain.evolves_to[0].species.name);
    console.log(evoData.chain.evolves_to[0].evolves_to.length);
    if (evoData.chain.evolves_to[0].evolves_to.length > 0) {
      console.log(evoData.chain.evolves_to[0].evolves_to[0].species.name);

    }

    console.log(evoData.chain.evolves_to[0].evolution_details[0].trigger.name);
    if (evoData.chain.evolves_to[0].evolution_details[0].trigger.name == 'use-item') {
      console.log(evoData.chain.evolves_to[0].evolution_details[0].item.name);
      // `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`
    }
    console.log(evoData.chain.evolves_to[0].evolution_details[0].min_level);

    const evolutionGrid = document.createElement('div');
    evolutionGrid.id = 'evolution-grid';
    this.container.appendChild(evolutionGrid)

    let firstEvo = {}
    allPokeData.forEach((poke) => {
      if (evoData.chain.species.name == poke.name) {
        firstEvo = poke
      }
    })
    console.log(firstEvo);
    const displayFirstEvo = document.createElement('div');
    displayFirstEvo.classList.add('evolution-tiles');

    const sprite = document.createElement('img');
    sprite.src = `../../images/sprite/${evoData.chain.species.url.slice(42, (evoData.chain.species.url.length-1))}.png`;
    sprite.classList.add('sprite-size')
    displayFirstEvo.appendChild(sprite);

    const natNo = document.createElement('div');
    let number = firstEvo.id;
    if (number < 10) {
      number = '#00' + number;
    } else if (number < 100) {
      number = '#0' + number;
    } else {
      number = '#' + number;
    }
    natNo.textContent = number;
    console.log(natNo);
    displayFirstEvo.appendChild(natNo);

    const name = document.createElement('div');
    name.textContent = evoData.chain.species.name.charAt(0).toUpperCase() + evoData.chain.species.name.slice(1);
    name.id = 'h3'
    displayFirstEvo.appendChild(name);

    const displayTypes = document.createElement('div');
    const type1 = firstEvo.types[0];
    const type2 = firstEvo.types[1];
    if (type2 == undefined) {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span>`
    } else {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span><span class='type-icon type-${type2.toLowerCase()}'>${type2}</span>`;
    }
    displayFirstEvo.appendChild(displayTypes);

    if ((evoData.chain.species.url.slice(42, (evoData.chain.species.url.length-1))) < 152) {
      evolutionGrid.appendChild(displayFirstEvo);
    }

  }
}

module.exports = EvoView;
