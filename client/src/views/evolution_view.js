const PubSub = require('../helpers/pub_sub.js');
const RequestHelper = require('../helpers/request_helper.js');


class EvoView {
  constructor(container) {
    this.container = container
    this.allPokeData = []
  }

  bindEvents() {
    //get information on all pokemon so that evo information can be shown even if the user doesnt have that stage of the evolution
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
          // pick out the specific information that i want to display in the evolution view
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
          pokemon.imageurl = `../../images/sprite/${poke.id}.png`
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

  clearView() {
    this.container.innerHTML = ''
  }

  renderEvo(evoData, pokemon, allPokeData) {

    this.clearView()
    const evolutionGrid = document.createElement('div');
    evolutionGrid.id = 'evolution-grid';
    this.container.appendChild(evolutionGrid)

    // display the first level of the pokemon's evolution chain
    // dont show any pokemon not in this generation
    if ((evoData.chain.species.url.slice(42, (evoData.chain.species.url.length - 1))) < 152) {
      var displayFirstEvo = this.renderFirstEvo(evoData, pokemon, allPokeData)
    }

    if ((evoData.chain.evolves_to.length === 1) && ((evoData.chain.species.url.slice(42, (evoData.chain.species.url.length - 1))) < 152) && ((evoData.chain.evolves_to[0].species.url.slice(42, (evoData.chain.evolves_to[0].species.url.length - 1))) < 152)) {
      var displayGridArrow1 = this.renderGridArrow1(evoData, pokemon, allPokeData);
    } else if (evoData.chain.evolves_to.length > 1) {
      var displayArrowOption = []
      for (var i = 0; i < evoData.chain.evolves_to.length; i++) {
        if ((evoData.chain.evolves_to[i].species.url.slice(42, (evoData.chain.evolves_to[i].species.url.length - 1))) < 152) {
          const arrowOption = this.renderArrowOptions(evoData.chain.evolves_to[i], pokemon, allPokeData, i)
          displayArrowOption.push(arrowOption)
        }
      }
    }
    // IF there is a second stage, display the second level of the pokemon's evolution chain
    // dont show any pokemon not in this generation
    var displaySecondEvoOption = []
    if (evoData.chain.evolves_to.length === 1) {
      if ((evoData.chain.evolves_to[0].species.url.slice(42, (evoData.chain.evolves_to[0].species.url.length - 1))) < 152) {
        var displaySecondEvo = this.renderSecondEvo(evoData, pokemon, allPokeData)
      }
    } else if (evoData.chain.evolves_to.length > 1) {
      for (var i = 0; i < evoData.chain.evolves_to.length; i++) {
        if ((evoData.chain.evolves_to[i].species.url.slice(42, (evoData.chain.evolves_to[i].species.url.length - 1))) < 152) {
          const evoOption = this.renderSecondEvoOptions(evoData.chain.evolves_to[i], pokemon, allPokeData, i)
          displaySecondEvoOption.push(evoOption)
          console.log(evoOption);
        }
      }
    }

    if (evoData.chain.evolves_to.length === 1) {
      if ((evoData.chain.evolves_to[0].evolves_to.length === 1) && ((evoData.chain.evolves_to[0].species.url.slice(42, (evoData.chain.evolves_to[0].species.url.length - 1))) < 152) && ((evoData.chain.evolves_to[0].evolves_to[0].species.url.slice(42, (evoData.chain.evolves_to[0].evolves_to[0].species.url.length - 1))) < 152)) {
        var displayGridArrow2 = this.renderGridArrow2(evoData, pokemon, allPokeData);
      }
    }
    // IF there is a third stage, display the third level of the pokemon's evolution chain
    // dont show any pokemon not in this generation
    if (evoData.chain.evolves_to.length === 1) {
      if (evoData.chain.evolves_to[0].evolves_to.length === 1) {
        if ((evoData.chain.evolves_to[0].evolves_to[0].species.url.slice(42, (evoData.chain.evolves_to[0].evolves_to[0].species.url.length - 1))) < 152) {
          var displayThirdEvo = this.renderThirdEvo(evoData, pokemon, allPokeData)
        }
      }
    }

    // Append evolution stages and arrows onto the container, checking that all the stages exist
    if ((evoData.chain.species.url.slice(42, (evoData.chain.species.url.length - 1))) < 152) {
      if (displaySecondEvoOption.length < 3) {
        displayFirstEvo.classList.add('grid-row-1');
      } else if (displaySecondEvoOption.length < 5) {
        displayFirstEvo.classList.add('grid-row-2');
      } else if (displaySecondEvoOption.length < 7) {
        displayFirstEvo.classList.add('grid-row-3');
      } else if (displaySecondEvoOption.length < 9) {
        displayFirstEvo.classList.add('grid-row-4');
      }
      evolutionGrid.appendChild(displayFirstEvo);
      if (evoData.chain.evolves_to.length === 1) {
        evolutionGrid.appendChild(displayGridArrow1);
      } else if (evoData.chain.evolves_to.length > 1) {
        for (var i = 0; i < evoData.chain.evolves_to.length; i++) {
          if ((evoData.chain.evolves_to[i].species.url.slice(42, (evoData.chain.evolves_to[i].species.url.length - 1))) < 152) {
            evolutionGrid.appendChild(displayArrowOption[i]);
          }
        }
      }
    }

    console.log(evoData.chain.evolves_to.length);
    if (evoData.chain.evolves_to.length === 1) {
      if ((evoData.chain.evolves_to[0].species.url.slice(42, (evoData.chain.evolves_to[0].species.url.length - 1))) < 152) {
        evolutionGrid.appendChild(displaySecondEvo);
        if (evoData.chain.evolves_to[0].evolves_to.length === 1) {
          evolutionGrid.appendChild(displayGridArrow2);
        }
      }
    } else if (evoData.chain.evolves_to.length > 1) {
      for (var i = 0; i < evoData.chain.evolves_to.length; i++) {
        if ((evoData.chain.evolves_to[i].species.url.slice(42, (evoData.chain.evolves_to[i].species.url.length - 1))) < 152) {
          evolutionGrid.appendChild(displaySecondEvoOption[i]);
        }
      }
    }
    if (evoData.chain.evolves_to.length === 1) {
      if (evoData.chain.evolves_to[0].evolves_to.length === 1) {
        if ((evoData.chain.evolves_to[0].evolves_to[0].species.url.slice(42, (evoData.chain.evolves_to[0].evolves_to[0].species.url.length - 1))) < 152) {
          evolutionGrid.appendChild(displayThirdEvo);
        }
      }
    }

  }


  renderFirstEvo(evoData, pokemon, allPokeData) {
    let firstEvo = {}
    allPokeData.forEach((poke) => {
      if (evoData.chain.species.name == poke.name) {
        firstEvo = poke
      }
    })
    var displayFirstEvo = document.createElement('div');
    displayFirstEvo.classList.add('evolution-tiles', 'grid-row-1');

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

    return displayFirstEvo;
  }

  renderGridArrow1(evoData, pokemon, allPokeData) {
    var gridArrow1 = document.createElement('div');
    gridArrow1.id = 'grid-arrow-1';
    gridArrow1.classList.add('grid-row-1')

    const arrowImg = document.createElement('img');
    arrowImg.id = 'arrow-img';
    arrowImg.src = './images/arrow.png'
    gridArrow1.appendChild(arrowImg);

    if (evoData.chain.evolves_to[0].evolution_details[0].trigger.name == 'level-up') {
      const lvlNo = document.createElement('p');
      let lvl = evoData.chain.evolves_to[0].evolution_details[0].min_level;
      lvlNo.textContent = `(level ${lvl})`;
      gridArrow1.appendChild(lvlNo);
    } else if (evoData.chain.evolves_to[0].evolution_details[0].trigger.name == 'use-item') {
      const itemName = document.createElement('p');
      const itemArr = evoData.chain.evolves_to[0].evolution_details[0].item.name.split('-');
      const newArr = []
      itemArr.forEach((item) => {
        item = item.charAt(0).toUpperCase() + item.slice(1);
        newArr.push(item)
      })
      let name = '';
      for (let names of newArr) {
        name += `${names} `
      }
      console.log(name);
      itemName.textContent = name
      gridArrow1.appendChild(itemName)

      const itemImage = document.createElement('img');
      itemImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evoData.chain.evolves_to[0].evolution_details[0].item.name}.png`
      gridArrow1.appendChild(itemImage)
    }
    return gridArrow1;
  }

  renderSecondEvo(evoData, pokemon, allPokeData) {
    let secondEvo = {}
    allPokeData.forEach((poke) => {
      if (evoData.chain.evolves_to[0].species.name == poke.name) {
        secondEvo = poke
      }
    })
    var displaySecondEvo = document.createElement('div');
    displaySecondEvo.classList.add('evolution-tiles', 'grid-row-1');

    const sprite = document.createElement('img');
    sprite.src = `../../images/sprite/${evoData.chain.evolves_to[0].species.url.slice(42, (evoData.chain.evolves_to[0].species.url.length-1))}.png`;
    sprite.classList.add('sprite-size')
    displaySecondEvo.appendChild(sprite);

    const natNo = document.createElement('div');
    let number = secondEvo.id;
    if (number < 10) {
      number = '#00' + number;
    } else if (number < 100) {
      number = '#0' + number;
    } else {
      number = '#' + number;
    }
    natNo.textContent = number;
    displaySecondEvo.appendChild(natNo);

    const name = document.createElement('div');
    name.textContent = evoData.chain.evolves_to[0].species.name.charAt(0).toUpperCase() + evoData.chain.evolves_to[0].species.name.slice(1);
    name.id = 'h3'
    displaySecondEvo.appendChild(name);

    const displayTypes = document.createElement('div');
    const type1 = secondEvo.types[0];
    const type2 = secondEvo.types[1];
    if (type2 == undefined) {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span>`
    } else {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span><span class='type-icon type-${type2.toLowerCase()}'>${type2}</span>`;
    }
    displaySecondEvo.appendChild(displayTypes);

    return displaySecondEvo;
  }

  renderGridArrow2(evoData, pokemon, allPokeData) {
    var gridArrow2 = document.createElement('div');
    gridArrow2.id = 'grid-arrow-1';
    gridArrow2.classList.add('grid-row-1')

    const arrowImg = document.createElement('img');
    arrowImg.id = 'arrow-img';
    arrowImg.src = './images/arrow.png'
    gridArrow2.appendChild(arrowImg);

    if (evoData.chain.evolves_to[0].evolves_to[0].evolution_details[0].trigger.name == 'level-up') {
      const lvlNo = document.createElement('p');
      let lvl = evoData.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level;
      lvlNo.textContent = `(level ${lvl})`;
      gridArrow2.appendChild(lvlNo);
    } else if (evoData.chain.evolves_to[0].evolves_to[0].evolution_details[0].trigger.name == 'use-item') {
      const itemName = document.createElement('p');
      const itemArr = evoData.chain.evolves_to[0].evolves_to[0].evolution_details[0].item.name.split('-');
      const newArr = []
      itemArr.forEach((item) => {
        item = item.charAt(0).toUpperCase() + item.slice(1);
        newArr.push(item)
      })
      let name = '';
      for (let names of newArr) {
        name += `${names} `
      }
      console.log(name);
      itemName.textContent = name
      gridArrow2.appendChild(itemName)

      const itemImage = document.createElement('img');
      itemImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evoData.chain.evolves_to[0].evolves_to[0].evolution_details[0].item.name}.png`
      gridArrow2.appendChild(itemImage)
    }

    return gridArrow2;
  }

  renderThirdEvo(evoData, pokemon, allPokeData) {
    let thirdEvo = {}
    allPokeData.forEach((poke) => {
      if (evoData.chain.evolves_to[0].evolves_to[0].species.name == poke.name) {
        thirdEvo = poke
      }
    })

    var displayThirdEvo = document.createElement('div');
    displayThirdEvo.classList.add('evolution-tiles', 'grid-row-1');

    const sprite = document.createElement('img');
    sprite.src = `../../images/sprite/${evoData.chain.evolves_to[0].evolves_to[0].species.url.slice(42, (evoData.chain.evolves_to[0].evolves_to[0].species.url.length-1))}.png`;
    sprite.classList.add('sprite-size')
    displayThirdEvo.appendChild(sprite);

    const natNo = document.createElement('div');
    let number = thirdEvo.id;
    if (number < 10) {
      number = '#00' + number;
    } else if (number < 100) {
      number = '#0' + number;
    } else {
      number = '#' + number;
    }
    natNo.textContent = number;
    displayThirdEvo.appendChild(natNo);

    const name = document.createElement('div');
    name.textContent = evoData.chain.evolves_to[0].evolves_to[0].species.name.charAt(0).toUpperCase() + evoData.chain.evolves_to[0].evolves_to[0].species.name.slice(1);
    name.id = 'h3'
    displayThirdEvo.appendChild(name);

    const displayTypes = document.createElement('div');
    const type1 = thirdEvo.types[0];
    const type2 = thirdEvo.types[1];
    if (type2 == undefined) {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span>`
    } else {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span><span class='type-icon type-${type2.toLowerCase()}'>${type2}</span>`;
    }
    displayThirdEvo.appendChild(displayTypes);
    return displayThirdEvo;
  }

  renderSecondEvoOptions(evoData, pokemon, allPokeData, i) {
    let evoOption = {}
    allPokeData.forEach((poke) => {
      if (evoData.species.name == poke.name) {
        evoOption = poke
      }
    })

    var displayEvoOption = document.createElement('div');
    displayEvoOption.classList.add('evolution-tiles', `grid-row-${i}`, 'grid-column-3');

    const sprite = document.createElement('img');
    sprite.src = `../../images/sprite/${evoData.species.url.slice(42, (evoData.species.url.length-1))}.png`;
    sprite.classList.add('sprite-size')
    displayEvoOption.appendChild(sprite);

    const natNo = document.createElement('div');
    let number = evoOption.id;
    if (number < 10) {
      number = '#00' + number;
    } else if (number < 100) {
      number = '#0' + number;
    } else {
      number = '#' + number;
    }
    natNo.textContent = number;
    displayEvoOption.appendChild(natNo);

    const name = document.createElement('div');
    name.textContent = evoData.species.name.charAt(0).toUpperCase() + evoData.species.name.slice(1);
    name.id = 'h3'
    displayEvoOption.appendChild(name);

    const displayTypes = document.createElement('div');
    const type1 = evoOption.types[0];
    const type2 = evoOption.types[1];
    if (type2 == undefined) {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span>`
    } else {
      displayTypes.innerHTML = `<span class='type-icon type-${type1.toLowerCase()}'>${type1}</span><span class='type-icon type-${type2.toLowerCase()}'>${type2}</span>`;
    }
    displayEvoOption.appendChild(displayTypes);
    return displayEvoOption;
  }

  renderArrowOptions(evoData, pokemon, allPokeData, i) {
    var gridArrow = document.createElement('div');
   gridArrow.id = 'grid-arrow-1';
   gridArrow.classList.add(`grid-row-${i}`, 'grid-column-2')

    const arrowImg = document.createElement('img');
    arrowImg.id = 'arrow-img';
    arrowImg.src = './images/arrow.png'
   gridArrow.appendChild(arrowImg);

    if (evoData.evolution_details[0].trigger.name == 'level-up') {
      const lvlNo = document.createElement('p');
      let lvl = evoData.evolution_details[0].min_level;
      lvlNo.textContent = `(level ${lvl})`;
     gridArrow.appendChild(lvlNo);
   } else if (evoData.evolution_details[0].trigger.name == 'use-item') {
      const itemName = document.createElement('p');
      const itemArr = evoData.evolution_details[0].item.name.split('-');
      const newArr = []
      itemArr.forEach((item) => {
        item = item.charAt(0).toUpperCase() + item.slice(1);
        newArr.push(item)
      })
      let name = '';
      for (let names of newArr) {
        name += `${names} `
      }
      console.log(name);
      itemName.textContent = name
     gridArrow.appendChild(itemName)

      const itemImage = document.createElement('img');
      itemImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evoData.evolution_details[0].item.name}.png`
     gridArrow.appendChild(itemImage)
    }

    return gridArrow;
  }
}




module.exports = EvoView;
