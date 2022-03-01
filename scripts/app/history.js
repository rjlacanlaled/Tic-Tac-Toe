import { TimeTravel } from "../enums/time-travel.js";
import { updateBoardHighlight, eventTarget } from "./tic-tac-toe-ui.js";
import { marker, BOARD_CHANGE_EVENT, currentHistoryIndex, gameOver, timeTravel, history, playerMoveHistory} from "./tic-tac-toe.js";

export default function History() {
  const nextButton = document.querySelector(".-next-button");
  const prevButton = document.querySelector(".-prev-button");

  [nextButton, prevButton].forEach((button) => {
    button.addEventListener("click", historyButtonClickHandler);
  });

  eventTarget.addEventListener(BOARD_CHANGE_EVENT, historyChangeHandler);

  // EVENT HANDLERS

  function historyButtonClickHandler(event) {
    if (!gameOver) return;
    const stringDirection = event.target.getAttribute("travel");

    const timeDirection =
      stringDirection == "forward" ? TimeTravel.Forward : TimeTravel.Backward;

    timeTravel(timeDirection, 1);
    const [player, positions] = playerMoveHistory[currentHistoryIndex];
    updateBoardHighlight(player, positions);
  }

  function historyChangeHandler(event) {
      prevButton.disabled = currentHistoryIndex <= 0;
      nextButton.disabled = currentHistoryIndex >= history.length - 1;
  }
}
