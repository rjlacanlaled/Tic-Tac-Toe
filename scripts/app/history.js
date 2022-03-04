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
  eventTarget.dispatchEvent(new Event(BOARD_CHANGE_EVENT));

  // EVENT HANDLERS

  function historyButtonClickHandler(event) {
    const stringDirection = event.target.getAttribute("travel");

    const timeDirection =
      stringDirection == "forward" ? TimeTravel.Forward : TimeTravel.Backward;

    timeTravel(timeDirection, 1);
    if (!gameOver) return;
    const [player, positions] = playerMoveHistory[currentHistoryIndex];
    updateBoardHighlight(marker[player], positions);
  }

  function historyChangeHandler(event) {
      prevButton.disabled = currentHistoryIndex <= 0;
      nextButton.disabled = currentHistoryIndex >= history.length - 1;
  }
}
