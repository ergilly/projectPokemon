const LibView = require('./library_view.js');



class LibTabs {
  constructor() {
    this.storedTypes = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
  }

  rightArrow(pokemon) {
    console.log(LibView);
    const tabName = document.querySelector('#tab-type');
    let currentTab = '';
    let index = 0;
    if (tabName.textContent == "All") {
      currentTab = document.querySelector('#grid2-container');
      index = 20;
    } else {
      for (var i = 0; i < this.storedTypes.length; i++) {
        if (tabName.textContent.toLowerCase() == this.storedTypes[i]) {
          currentTab = document.querySelector(`.grid-${this.storedTypes[i]}`);
          index = i;
        }
      }
    }
    currentTab.style.display = 'none';

    if (index == 20) {
      const newTab = document.querySelector(`.grid-${this.storedTypes[0]}`)
      tabName.textContent = "normal"
      newTab.style.display = 'grid';
      tabName.classList.add('type-normal')
    } else if (index == 17) {
      const newTab = document.querySelector(`#grid2-container`)
      newTab.style.display = 'grid';
      tabName.textContent = "All"
      tabName.classList.remove('type-fairy')
    } else {
      const newTab = document.querySelector(`.grid-${this.storedTypes[index+1]}`)
      newTab.style.display = 'grid';
      tabName.textContent = (this.storedTypes[index+1])
      tabName.classList.remove(`type-${this.storedTypes[index]}`)
      tabName.classList.add(`type-${this.storedTypes[index+1]}`)
    }

    const libContainer = document.querySelector('#library');
    const libraryView = new LibView(libContainer)
    pokemon.forEach((poke) => {
      this.lightUpPoke(poke)
    })
  }

  leftArrow() {
    const tabName = document.querySelector('#tab-type');
    let currentTab = '';
    let index = 0;
    if (tabName.textContent == "All") {
      currentTab = document.querySelector('#grid2-container');
      index = 20;
    } else {
      for (var i = 0; i < this.storedTypes.length; i++) {
        if (tabName.textContent.toLowerCase() == this.storedTypes[i]) {
          currentTab = document.querySelector(`.grid-${this.storedTypes[i]}`);
          index = i;
        }
      }
    }
    currentTab.style.display = 'none';

    if (index == 20) {
      const newTab = document.querySelector(`.grid-${this.storedTypes[17]}`)
      tabName.textContent = "fairy"
      newTab.style.display = 'grid';
      tabName.classList.add('type-fairy')
    } else if (index == 0) {
      const newTab = document.querySelector(`#grid2-container`)
      newTab.style.display = 'grid';
      tabName.textContent = "All"
      tabName.classList.remove('type-normal')
    } else {
      const newTab = document.querySelector(`.grid-${this.storedTypes[index-1]}`)
      newTab.style.display = 'grid';
      tabName.textContent = (this.storedTypes[index-1])
      tabName.classList.remove(`type-${this.storedTypes[index]}`)
      tabName.classList.add(`type-${this.storedTypes[index-1]}`)
    }  }
}

module.exports = LibTabs;
