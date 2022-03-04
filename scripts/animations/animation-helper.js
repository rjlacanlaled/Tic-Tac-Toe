export function getUpdatedRect(rect) {
    return rect.getBoundingClientRect();
}

export function updateElementPosition(element, top, right, bottom, left) {
    if (top !== null) element.style.top = top + "px";
    if (right !== null) element.style.right = right + "px";
    if (bottom !== null) element.style.bottom = bottom + "px";
    if (left !== null) element.style.left = left + "px";
}