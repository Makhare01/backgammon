export class Dice {
  constructor(width, height) {
    this.status = localStorage.getItem("status");
    this.currentPlayer = localStorage.getItem("current-player");

    const dicesContainer = document.getElementById("dices-container");
    dicesContainer.classList.add("dices-container");
    dicesContainer.style.left = `calc(50% - ${width / 2}px)`;
    dicesContainer.style.top = `calc(50% - ${height / 8}px)`;
    dicesContainer.style.width = width + "px";
    dicesContainer.style.height = height / 4 + "px";

    this.dicesContainer = dicesContainer;
    this.#drawDices()
  }

  addRollButton() {
    const first = JSON.parse(localStorage.getItem('first'))
    const second = JSON.parse(localStorage.getItem('second'))

    if(!first && !second) {
      const rollButton = document.createElement("button");
      rollButton.classList.add("roll-button");
      rollButton.setAttribute("id", "roll-button");
      rollButton.textContent = "ROLL";
      rollButton.addEventListener("click", () => {
        document.getElementById("roll-button").remove();
        const audio = document.getElementById("roll-sound");
        audio.play();
        this.#roll();
      });

      this.dicesContainer.appendChild(rollButton);
    }
    
  }

  #roll() {
    const first = Math.floor(Math.random() * 6) + 1;
    const second = Math.floor(Math.random() * 6) + 1;

    if(first == second) {
      localStorage.setItem("first", JSON.stringify(Array(2).fill(first)));
      localStorage.setItem("second", JSON.stringify(Array(2).fill(second)));
    }
    else {
      localStorage.setItem("first", first);
      localStorage.setItem("second", second);
    }

    

    localStorage.setItem("status", "PLAYING");
    this.status = "PLAYING";

    this.#drawDices()
  }

  #drawDices() {
    const first = JSON.parse(localStorage.getItem('first'))
    const second = JSON.parse(localStorage.getItem('second'))

    if(first && second) {
      const dices = document.createElement("div");
      const firstDice = document.createElement("img");
      firstDice.src = `./images/dice/${Array.isArray(first) ? first[0] : first}.png`;
      const secondDice = document.createElement("img");
      secondDice.src = `./images/dice/${Array.isArray(second) ? second[0] : second}.png`;

      dices.classList.add("dice-container");
      dices.setAttribute("id", "dice-container");
      dices.appendChild(firstDice);
      dices.appendChild(secondDice);
      this.dicesContainer.appendChild(dices); 
    }
  }

  get getStatus() {
    return this.status;
  }
}
