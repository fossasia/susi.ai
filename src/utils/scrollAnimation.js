const scrollAnimation = (element, to, duration, direction) => {
  const start = element.scrollTop,
    change = to - start,
    increment = 20;
  let currentTime = 0;

  const animateScroll = () => {
    currentTime += increment;
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    if (direction === 'horizontal') {
      element.scrollLeft = val;
    } else if (direction === 'vertical') {
      element.scrollTop = val;
    }
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
};

// t = current time
// b = start value
// c = change in value
// d = duration
Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

export default scrollAnimation;
