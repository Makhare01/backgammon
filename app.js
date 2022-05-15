import { Dice } from "./dice.js";

export class App {
  constructor(app, width, height) {
    this.app = app;
    app.style.left = `calc(50% - ${width / 2}px)`;
    app.style.top = `calc(50% - ${height / 2}px)`;
    app.style.width = width + "px";
    app.style.height = height + "px";
    this.quarterWidth = (width - 40) / 2;

    this.dice = new Dice(width, height);
    this.dice.addRollButton();
    this.currentPlayer = localStorage.getItem("current-player");
    this.status = localStorage.getItem("status");
  }

  #resetBoard() {
    this.app.innerHTML = "";
    localStorage.setItem("status", "ROLLING");
    this.status = "ROLLING"
    localStorage.setItem(
      "current-player",
      this.currentPlayer === "BLACK" ? "WHITE" : "BLACK"
    );
    this.currentPlayer =
      this.currentPlayer === "BLACK" ? "WHITE" : "BLACK";
  }

  #drawRock(quarterItem, quarterIndex, index, k, pos) {
    const position = typeof pos === 'object' ? pos.position : pos
    const rock = document.createElement("div");
    rock.classList.add(position > 0 ? "WHITE" : "BLACK");
    Math.abs(position) - 1 == k && rock.setAttribute("id", quarterIndex * 6 + index);

    const rockClass = rock.getAttribute("class");
    if (rockClass.includes(this.currentPlayer)) {
      rock.classList.add("active-rock");
      rock.addEventListener("click", (event) => {
        this.#findPossibleMoves(Number(event.srcElement.id));
      });
    }

    quarterItem.appendChild(rock);
  }

  DrawtRocks() {
    const Positions = JSON.parse(localStorage.getItem("positions"));
    const quarterPositions = [];

    for (let i = 0; i < 4; i++) {
      const start = i * 6;
      const end = (i + 1) * 6;
      quarterPositions.push(Positions.slice(start, end));
    }

    for (let i = 0; i < 2; i++) {
      const firstQuarterContainer = document.createElement("div");
      firstQuarterContainer.classList.add("quarterContainer");

      for (let j = 0; j < 2; j++) {
        const quarter = document.createElement("div");
        quarter.classList.add("quarter");
        const quarterIndex = i === 1 ? i + j + 1 : i + j;

        quarterPositions[quarterIndex].forEach((pos, index) => {
          const quarterItem = document.createElement("div");
          quarterItem.classList.add("quarter-item");

          for (let k = 0; k < Math.abs(pos); k++) {
            this.#drawRock(quarterItem, quarterIndex, index, k, pos)
          }

          if(typeof pos === 'object') {
            this.#drawRock(quarterItem, quarterIndex, index, Math.abs(pos), pos)
          }

          quarter.appendChild(quarterItem);
        });

        firstQuarterContainer.appendChild(quarter);
      }

      this.app.appendChild(firstQuarterContainer);
    }
  }

  #findPossibleMoves(id) {
    const first = JSON.parse(localStorage.getItem('first'))
    const First = Array.isArray(first) ? first[0] : first

    const second = JSON.parse(localStorage.getItem('second'))
    const Second = Array.isArray(second) ? second[0] : second
    const currentPositions = JSON.parse(localStorage.getItem('positions'))
    const player = localStorage.getItem('current-player')


    // console.log(id, first, second)
    // console.log(currentPositions)

    const possibleMoves = []

    if(this.#checkIfCanMove(id, First, currentPositions)) {
      const index = player === 'WHITE' ? id-First : id+First

      possibleMoves.push({
        from: id,
        step: First,
        newPos: index
      })
    }

    if(this.#checkIfCanMove(id, Second, currentPositions)) {
      const index = player === 'WHITE' ? id-Second : id+Second
      
      possibleMoves.push({
        from: id,
        step: Second,
        newPos: index
      })
    }

    console.log('possibleMoves:', possibleMoves)

    this.#drawPossibleMovies(possibleMoves)
  }

  #drawPossibleMovies(possibleMoves) {
    localStorage.setItem('first', null)
    localStorage.setItem('second', null)

    this.#resetBoard();
    this.DrawtRocks();
    document.getElementById("dice-container").remove();
    this.dice.addRollButton();
  }

  #checkIfCanMove(pos, step, positions) {
    if(positions[pos] < 0) {
      const index = pos+step;
      if(index < 23 && (positions[index] <= 0 || positions[index] == 1)) return true
    }
    if(positions[pos] > 0) {
      const index = pos-step;
      if(index > 0 && (positions[index] >= 0 || positions[index] == -1)) return true
    }

    return false
  }
}
