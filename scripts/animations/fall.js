import { getUpdatedRect, updateElementPosition } from "./animation-helper.js";

export const FALL_END_EVENT = "fall_animation_end";
export default function animateDropObject(element, initialPos, target) {
    let id = null;
    let targetRect = getUpdatedRect(target);

    let pos = initialPos;
    let xCenter = targetRect.x + (targetRect.width / 2) - 25;

    updateElementPosition(element, initialPos, targetRect.right, null, xCenter);

    clearInterval(id);
    id = setInterval(animate, 10);

    function animate() {
        targetRect = getUpdatedRect(target);
        xCenter = targetRect.x + (targetRect.width / 2) - 25;
        
        updateElementPosition(element, )

        if (pos >= targetRect.top) {
            clearInterval(id);
            target.dispatchEvent(new Event(FALL_END_EVENT));
            element.dispatchEvent(new Event(FALL_END_EVENT));
        } 
        pos += 8;

        updateElementPosition(element, pos, targetRect.right, null, xCenter);
    }
}