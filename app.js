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
  }

  #getFirst() {
    if (localStorage.getItem("first") === "") return "";

    return JSON.parse(localStorage.getItem("first"));
  }

  #getSecond() {
    if (localStorage.getItem("second") === "") return "";

    return JSON.parse(localStorage.getItem("second"));
  }

  #drawRock(quarterItem, quarterIndex, index, k, pos, isKillable) {
    const ID = quarterIndex * 6 + index;

    const rock = document.createElement("div");
    rock.classList.add(isKillable ? "RED" : pos > 0 ? "WHITE" : "BLACK");
    Math.abs(pos) - 1 == k && rock.setAttribute("id", ID);

    const rockClass = rock.getAttribute("class");
    if (rockClass.includes(this.currentPlayer)) {
      rock.classList.add("active-rock");

      if (rock.hasAttribute("id")) {
        rock.addEventListener("click", (event) => {
          this.#findPossibleMoves(Number(event.srcElement.id));
        });
      }
    }

    if (isKillable) {
      const possibleMoviesbject = JSON.parse(
        localStorage.getItem("possibleMoviesObject")
      );
      const step = possibleMoviesbject.find((move) => move.newPos === ID)?.step;
      rock.classList.add("active-rock-red");

      rock.addEventListener("click", () => {
        this.#moveRock(ID, step);
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

          const isKillable = Array.isArray(pos);
          const endOfLoop = isKillable ? Math.abs(pos[0]) + 1 : pos;

          for (let k = 0; k < Math.abs(endOfLoop); k++) {
            const isLastKillable = isKillable && k === Math.abs(pos[0]);
            this.#drawRock(
              quarterItem,
              quarterIndex,
              index,
              k,
              pos,
              isLastKillable
            );
          }

          quarter.appendChild(quarterItem);
        });

        firstQuarterContainer.appendChild(quarter);
      }

      this.app.appendChild(firstQuarterContainer);
    }
  }

  #findPossibleMoves(id) {
    const first = this.#getFirst();
    const First = Array.isArray(first) ? first[0] : first;

    const second = this.#getSecond();
    const Second = Array.isArray(second) ? second[0] : second;
    const currentPositions = JSON.parse(localStorage.getItem("positions"));
    const player = localStorage.getItem("current-player");

    const possibleMoves = [];

    if (this.#checkIfCanMove(id, First, currentPositions)) {
      const index = player === "WHITE" ? id - First : id + First;

      possibleMoves.push({
        from: id,
        step: First,
        newPos: index,
      });
    }

    if (this.#checkIfCanMove(id, Second, currentPositions)) {
      const index = player === "WHITE" ? id - Second : id + Second;

      possibleMoves.push({
        from: id,
        step: Second,
        newPos: index,
      });
    }

    localStorage.setItem(
      "possibleMovies",
      possibleMoves.map((move) => move.newPos)
    );
    localStorage.setItem("possibleMoviesObject", JSON.stringify(possibleMoves));

    this.#drawPossibleMovies(currentPositions);
  }

  #clearPossibleMovies(currentPositions) {
    const clearedPositions = currentPositions.map((pos) =>
      Array.isArray(pos) ? pos[0] : pos
    );
    return clearedPositions;
  }

  #drawPossibleMovies(currentPositions) {
    const possibleMovesArr = localStorage.getItem("possibleMovies");
    const possibleMoves =
      possibleMovesArr !== ""
        ? possibleMovesArr.split(",").map((item) => Number(item))
        : [];

    const clearedPositions = this.#clearPossibleMovies(currentPositions);

    const newPositions = clearedPositions.map((pos, i) =>
      possibleMoves.includes(i) ? [pos] : pos
    );

    localStorage.setItem("positions", JSON.stringify(newPositions));

    this.#resetBoard();
    this.DrawtRocks();
  }

  #checkIfCanMove(pos, step, positions) {
    const position = Array.isArray(positions[pos])
      ? positions[pos][0]
      : positions[pos];

    if (position < 0 && step !== "") {
      const index = pos + step;
      const posIndex = Array.isArray(positions[index])
        ? positions[index][0]
        : positions[index];
      if (index < 23 && (posIndex <= 0 || posIndex == 1)) return true;
    }
    if (position > 0 && step !== "") {
      const index = pos - step;
      const posIndex = Array.isArray(positions[index])
        ? positions[index][0]
        : positions[index];
      if (index > 0 && (posIndex >= 0 || posIndex == -1)) return true;
    }

    return false;
  }

  #moveRock(id, step) {
    const first = this.#getFirst();
    const second = this.#getSecond();

    const currentPositions = this.#clearPossibleMovies(
      JSON.parse(localStorage.getItem("positions"))
    );
    const currentPlayer = localStorage.getItem("current-player");

    if (currentPlayer === "BLACK") {
      const rockFromMoveId = id - step;
      const newPositions = currentPositions.map((pos, i) => {
        if (i === rockFromMoveId) return pos + 1;
        if (i === id) return pos - 1;
        return pos;
      });

      localStorage.setItem("positions", JSON.stringify(newPositions));
    } else if (currentPlayer === "WHITE") {
      const rockFromMoveId = id + step;
      const newPositions = currentPositions.map((pos, i) => {
        if (i === rockFromMoveId) return pos - 1;
        if (i === id) return pos + 1;
        return pos;
      });

      localStorage.setItem("positions", JSON.stringify(newPositions));
    }

    if (first !== "" || second !== "") {
      if (Array.isArray(first)) localStorage.setItem("first", first[0]);
      else if (first === step) localStorage.setItem("first", "");
      else if (Array.isArray(second)) localStorage.setItem("second", second[0]);
      else localStorage.setItem("second", "");
    }

    if (this.#getFirst() === "" && this.#getSecond() === "") {
      document.getElementById("dice-container").remove();
      this.dice.addRollButton();

      localStorage.setItem("status", "ROLLING");
      this.status = "ROLLING";
      localStorage.setItem(
        "current-player",
        this.currentPlayer === "BLACK" ? "WHITE" : "BLACK"
      );
      this.currentPlayer = this.currentPlayer === "BLACK" ? "WHITE" : "BLACK";
    }

    this.#resetBoard();
    this.DrawtRocks();
    const audio = document.getElementById("roll-pick-up-sound");
    audio.play();
  }
}
