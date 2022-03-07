import initChooseSide from "./app/choose-side.js";
import initGameOver from "./app/game-over.js";
import initIntro, { showIntro } from "./app/intro.js";
import initTicTacToeApp from "./app/main-controller.js";

const body = document.getElementsByTagName("body")[0];

initIntro();
initChooseSide();
initTicTacToeApp();
initGameOver();
body.style.display = "block";