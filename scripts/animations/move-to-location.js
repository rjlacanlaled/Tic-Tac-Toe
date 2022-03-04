import { getUpdatedRect } from "./animation-helper";

const MOVE_TO_LOCATION_EVENT = "move_to_location";
export default function animateMoveToLocation(element, target) {
    let id = null;
    let elementRect = getUpdatedRect(element);
    let targetRect = getUpdatedRect(target);

    clearInterval(id);
    id = setInterval(animate, 10);
    const isGoingRight = targetRect.right < elementRect.right;
    const isGoingDown = targetRect.top < elementRect.top;
    let isHorizontalLocationReached = false;
    let isVerticalLocationReached = false;
    let horizontalPos = elementRect.right;
    let verticalPos = elementRect.top;

    function animate() {
        elementRect = getUpdatedRect(element);
        targetRect = getUpdatedRect(target);
        

        if (isGoingRight) {
           // if ()
           
        }
    }
}