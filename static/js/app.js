// DOM
const boardDOM = document.getElementsByClassName("tictoc-wrapper")[0];
const columnDOM = document.getElementsByClassName("col-4");
let playersDOM = document.querySelector(".player");
let activePlayerDOM = null;

// property
const winStates = [
  ["c1", "c2", "c3"],
  ["c4", "c5", "c6"],
  ["c7", "c8", "c9"],
  ["c1", "c4", "c7"],
  ["c2", "c5", "c8"],
  ["c3", "c6", "c9"],
  ["c1", "c5", "c9"],
  ["c3", "c5", "c7"],
];

const playerSprites = {
  playerCircle: "static/img/circle.png",
  playerX: "static/img/x.png",
};

const audioState = {
  warning: "static/voice/warning.aac",
  winner: "static/voice/win.aac",
};

const turnList = ["playerCircle", "playerX"];

const audio = new Audio();

let playerCounter = 0;
let turn = null;
let lockBoard = false;

changeTheTurn();

// set handlers
loopThrowDOMS(columnDOM, (element) =>
  element.addEventListener("click", columnDOMClickHandler)
);

// handlers
function columnDOMClickHandler(event) {
  const thisElement = this;

  if (lockBoard) return false;

  if (thisElement.dataset["player"] != undefined) {
    loadAudio(getLink(audioState["warning"]));
    return false;
  }
  thisElement.innerHTML = `<img src="${playerSprites[turn]}">`;
  thisElement.setAttribute("data-player", turn);
  activePlayerDOM.classList.remove("active");

  checkTheWinner();
  checkTheBoard();

  playerCounter++;
  if (turnList[playerCounter] == undefined) playerCounter = 0;

  changeTheTurn();
}

// helpers
function loopThrowDOMS(doms, funcHandler) {
  const tmpDOMS = Array.from(doms);
  tmpDOMS.forEach(funcHandler);
}

function activeTheBoard(element) {
  element.innerHTML = "";

  if (element.hasAttribute("data-player"))
    element.removeAttribute("data-player");

  changeTheTurn();
  boardDOM.classList.remove("disabled");
  lockBoard = false;
}

function cleanTheBoard() {
  loopThrowDOMS(columnDOM, (element) => {
    boardDOM.classList.add("disabled");
    lockBoard = true;
    setTimeout(activeTheBoard, 2000, element);
  });
}

function checkTheBoard() {
  let filledColumn = 0;
  loopThrowDOMS(columnDOM, (element) => {
    if (element.hasAttribute("data-player")) filledColumn++;
  });

  if (filledColumn == 9) cleanTheBoard();
}

function checkTheWinner() {
  for (var i = 0; i < winStates.length; i++) {
    const currentState = winStates[i];
    if (
      document.getElementsByClassName(currentState[0])[0].dataset["player"] !=
        undefined &&
      document.getElementsByClassName(currentState[1])[0].dataset["player"] !=
        undefined &&
      document.getElementsByClassName(currentState[2])[0].dataset["player"] !=
        undefined
    ) {
      if (
        document.getElementsByClassName(currentState[0])[0].dataset["player"] ==
          document.getElementsByClassName(currentState[1])[0].dataset[
            "player"
          ] &&
        document.getElementsByClassName(currentState[0])[0].dataset["player"] ==
          document.getElementsByClassName(currentState[2])[0].dataset["player"]
      ) {
        const score = document.getElementsByClassName(
          "score-" +
            document.getElementsByClassName(currentState[0])[0].dataset[
              "player"
            ]
        )[0];
        score.textContent = parseInt(score.textContent) + 1;
        loadAudio(getLink(audioState["winner"]));
        cleanTheBoard();
      }
    }
  }
}

function changeTheTurn() {
  turn = turnList[playerCounter];
  activePlayerDOM = document.getElementById(turn);
  activePlayerDOM.classList.add("active");
}

function getLink(link) {
  const tmpLink = location.href.replace("index.html", "") + link;
  return tmpLink;
}

function loadAudio(link) {
  audio.src = link;
  audio.onloadeddata = () => audio.play();
}
