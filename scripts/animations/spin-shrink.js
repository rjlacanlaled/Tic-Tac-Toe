import { getUpdatedRect, updateElementPosition } from "./animation-helper.js";

export const SPIN_SHRINK_EVENT = "spin-shrink";
export default function animateSpinShrink(element, spinTime, shrinkTime) {
    let id = null;
    let elementRect = getUpdatedRect(element);
    let width = element.width;
    let height = element.height;    

    element.style.minWidth = "0px";
    element.style.minHeight = "0px";
    element.style.position = "absolute";
    element.style.zIndex = "10";

    clearInterval(id);
    id = setInterval(animate, 10);
    let degrees = 0;

    function animate() {
        elementRect = getUpdatedRect(element);

        element.style.width = width-- + "px";
        element.style.height = height-- + "px";
        element.style.transform = `rotate(${degrees += 10}deg)`;
        if (degrees >= 360) degrees = 0;

        if (element.width <= 0) {
            clearInterval(id);
            element.dispatchEvent(new Event(SPIN_SHRINK_EVENT));
        }

    }
}