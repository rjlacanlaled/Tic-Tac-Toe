export default function animateOpacityTransition(
  element,
  from,
  to,
  duration = 1,
  delay = 0
) {
  element.style.opacity = from;
  let id;

  let isPositive = to > from;
  let calcDuration = duration * 60;
  let animationInterval = ((calcDuration / 60) * 1000) / calcDuration ;
  let opacityInterval = Math.abs(to - from) / calcDuration;

  setTimeout(() => {
    id = setInterval(animate, animationInterval);
  }, delay);

  function animate() {
    if (isPositive) {
        console.log("delay", delay);
      element.style.opacity = from += opacityInterval;
      if (from >= to) clearInterval(id);
    } else {
      element.style.opacity = from -= opacityInterval;
      if (from <= to) clearInterval(id);
    }
  }
}
