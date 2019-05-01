const PubSub = require('../helpers/pub_sub.js');
const EvoView = require('./evolution_view.js');

class PokeView {
  constructor(container) {
    this.container = container
  }

  renderView(pokemon, data) {
    this.clearView();
    this.renderPic(pokemon);
    this.renderData(pokemon);
    this.renderStats(pokemon);
    const evoData = document.querySelector('#evolution-data');
    const evoView = new EvoView(evoData);
    evoView.renderView(pokemon, data);
  }

  clearView() {
    this.container.innerHTML = '';
  }

  renderPic(pokemon) {
    const card = document.createElement('div');
    card.id = "image-card"
    card.classList.add('ui', 'card');

    const pictureContainer = document.createElement('a');
    pictureContainer.id = "padding"
    pictureContainer.classList.add('image-cont');

    const picture = document.createElement('img');
    const name = pokemon.name.toLowerCase();
    picture.src = `./images/splash/${name}.jpg`
    picture.alt = `https://img.pokemondb.net/artwork/${name}.jpg`;
    picture.classList.add('image');

    const description = document.createElement('div');
    description.classList.add('content');

    const header = document.createElement('div');
    header.classList.add('header');
    header.textContent = `${pokemon.name} - Lvl: ${pokemon.stats.level}`;

    pictureContainer.appendChild(picture);
    card.appendChild(pictureContainer);
    description.appendChild(header);
    card.appendChild(description);
    this.container.appendChild(card);
  }

  renderData(pokemon) {
    const card = document.createElement('div');
    card.id = "poke-info-card"
    card.classList.add('ui', 'card');

    const table = document.createElement('table');
    table.id = 'pokedex-table';

    //create first table rows with specific classes
    const tableRow1 = document.createElement('tr');
    tableRow1.id = 'poke-national-no';
    table.appendChild(tableRow1);

    const tableRow2 = document.createElement('tr');
    tableRow2.id = 'poke-types';
    table.appendChild(tableRow2);

    const tableRow3 = document.createElement('tr');
    tableRow3.id = 'poke-height';
    table.appendChild(tableRow3);

    const tableRow4 = document.createElement('tr');
    tableRow4.id = 'poke-weight';
    table.appendChild(tableRow4);

    const tableRow5 = document.createElement('tr');
    tableRow5.id = 'poke-abilities';
    table.appendChild(tableRow5);

    // row1
    const natno = document.createElement('th');
    natno.textContent = 'National No:';
    tableRow1.appendChild(natno);
    const natnoValue = document.createElement('td');
    natnoValue.textContent = pokemon.natno;
    tableRow1.appendChild(natnoValue);
    // row2
    const type = document.createElement('th');
    type.textContent = 'Type:';
    tableRow2.appendChild(type);
    const typeValue = document.createElement('td');
    typeValue.id = 'poke-specific-type';
    tableRow2.appendChild(typeValue);

    const types = pokemon.types.split('-');
    const type1 = types[0].toLowerCase();
    let type2 = types[1];
    if (type2 == undefined) {
      typeValue.innerHTML = `<span class='type-icon type-${type1}'>${type1}</span>`
    } else {
      type2 = type2.toLowerCase();
      typeValue.innerHTML = `<span class='type-icon type-${type1}'>${type1}</span><span class='type-icon type-${type2}'>${type2}</span>`;
    }

    // row3
    const height = document.createElement('th');
    height.textContent = 'Height:';
    tableRow3.appendChild(height);
    const heightValue = document.createElement('td');
    heightValue.textContent = `${pokemon.height}m`;
    tableRow3.appendChild(heightValue);
    // row4
    const weight = document.createElement('th');
    weight.textContent = 'Weight:';
    tableRow4.appendChild(weight);
    const weightValue = document.createElement('td');
    weightValue.textContent = `${pokemon.weight}kg`;
    tableRow4.appendChild(weightValue);

    // Row5
    const abilities = document.createElement('th');
    abilities.textContent = 'Abilities:';
    tableRow5.appendChild(abilities);
    const abilityValue = document.createElement('td');
    abilityValue.id = 'poke-specific-ability';
    tableRow5.appendChild(abilityValue);

    const abilityArray = pokemon.abilities.split('+');

    for (var i = 1; i < abilityArray.length; i++) {
      let hidden = this.checkHidden(abilityArray[i]);
      let name = abilityArray[i];
      name = name.charAt(0).toUpperCase() + name.slice(1);
      if (hidden == true) {
        var ability = document.createElement('small');
        ability.textContent = `${name.slice(0, (name.length-2))} (hidden ability)`;
      } else {
        var ability = document.createElement('a');
        ability.textContent = name;

      };
      abilityValue.appendChild(ability);
      if (i > -1) {
        let newLine = document.createElement('br');
        abilityValue.appendChild(newLine);
      };
    };


    card.appendChild(table);
    this.container.appendChild(card);



  }

  renderStats(pokemon) {
    const card = document.createElement('div');
    card.id = "stats-card"
    card.classList.add('ui', 'card');

    const table = document.createElement('table');
    table.id = 'stats-table';
    card.appendChild(table);

    //create first table rows with specific classes
    const tableRow1 = document.createElement('tr');
    tableRow1.id = 'poke-hp';
    table.appendChild(tableRow1);

    const tableRow2 = document.createElement('tr');
    tableRow2.id = 'poke-attk';
    table.appendChild(tableRow2);

    const tableRow3 = document.createElement('tr');
    tableRow3.id = 'poke-def';
    table.appendChild(tableRow3);

    const tableRow4 = document.createElement('tr');
    tableRow4.id = 'poke-sp-attk';
    table.appendChild(tableRow4);

    const tableRow5 = document.createElement('tr');
    tableRow5.id = 'poke-sp-def';
    table.appendChild(tableRow5);

    const tableRow6 = document.createElement('tr');
    tableRow6.id = 'poke-speed';
    table.appendChild(tableRow6);

    const health = document.createElement('th');
    health.textContent = 'Health:';
    tableRow1.appendChild(health);
    const healthValue = document.createElement('td');
    healthValue.textContent = pokemon.stats.health;
    tableRow1.appendChild(healthValue);

    const attack = document.createElement('th');
    attack.textContent = 'attack:';
    tableRow2.appendChild(attack);
    const attackValue = document.createElement('td');
    attackValue.textContent = pokemon.stats.attack;
    tableRow2.appendChild(attackValue);

    const defense = document.createElement('th');
    defense.textContent = 'defense:';
    tableRow3.appendChild(defense);
    const defenseValue = document.createElement('td');
    defenseValue.textContent = pokemon.stats.defense;
    tableRow3.appendChild(defenseValue);

    const sp_attk = document.createElement('th');
    sp_attk.textContent = 'sp_attk:';
    tableRow4.appendChild(sp_attk);
    const sp_attkValue = document.createElement('td');
    sp_attkValue.textContent = pokemon.stats.sp_attk;
    tableRow4.appendChild(sp_attkValue);

    const sp_def = document.createElement('th');
    sp_def.textContent = 'sp_def:';
    tableRow5.appendChild(sp_def);
    const sp_defValue = document.createElement('td');
    sp_defValue.textContent = pokemon.stats.sp_def;
    tableRow5.appendChild(sp_defValue);

    const speed = document.createElement('th');
    speed.textContent = 'speed:';
    tableRow6.appendChild(speed);
    const speedValue = document.createElement('td');
    speedValue.textContent = pokemon.stats.speed;
    tableRow6.appendChild(speedValue);

    this.container.appendChild(card);

  }

  checkHidden(ability) {
    if (ability.charAt(ability.length - 1) == 'h') {
      return true
    }
  }

}

module.exports = PokeView;
