// Get the top position of an element in the document
const getTop = function(element, start) {
  // return value of html.getBoundingClientRect().top ... IE : 0, other browsers : -pageYOffset
  if (element.nodeName === 'HTML') {
    return -start
  }
  return element.getBoundingClientRect().top + start
}

export default function(scrollTo, speed = 1, minDuration = 0, maxDuration = 1300, offset = 0, container = window, callback) {
  const requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    (fn => {
      window.setTimeout(fn, 16)
    })

  // Attach the smoothscroll function
  const startPoint = container.scrollTop || window.pageYOffset
  // Get the top position of an element in the document
  // return value of html.getBoundingClientRect().top ... IE : 0, other browsers : -pageYOffset
  let end = getTop(scrollTo, startPoint)

  // Ajusts offset from the end
  end += offset

  // Adjust if we try to scroll too far
  if (end + window.innerHeight > container.scrollHeight) {
    end = container.scrollHeight - window.innerHeight
  }

  // Speed is in px/ms
  const duration = Math.max(Math.min(Math.abs(end - startPoint) / speed, maxDuration), minDuration)

  const clock = Date.now()
  const step = function() {
    // the time elapsed from the beginning of the scroll
    const elapsed = Date.now() - clock
    // calculate the scroll position we should be in
    let position = end
    if (elapsed < duration) {
      position = startPoint + (end - startPoint) * easingFunctions.easeInOutCubic(elapsed / duration)

      requestAnimationFrame(step)
    }

    container === window ? container.scrollTo(0, position) : (container.scrollTop = position)

    if (elapsed >= duration && typeof callback === 'function') {
      callback()
    }
  }
  step()
}

const easingFunctions = {
  // no easing, no acceleration
  linear: function(t) {
    return t
  },
  // accelerating from zero velocity
  easeInQuad: function(t) {
    return t * t
  },
  // decelerating to zero velocity
  easeOutQuad: function(t) {
    return t * (2 - t)
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  },
  // accelerating from zero velocity
  easeInCubic: function(t) {
    return t * t * t
  },
  // decelerating to zero velocity
  easeOutCubic: function(t) {
    return (--t) * t * t + 1
  },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },
  // accelerating from zero velocity
  easeInQuart: function(t) {
    return t * t * t * t
  },
  // decelerating to zero velocity
  easeOutQuart: function(t) {
    return 1 - (--t) * t * t * t
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function(t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
  },
  // accelerating from zero velocity
  easeInQuint: function(t) {
    return t * t * t * t * t
  },
  // decelerating to zero velocity
  easeOutQuint: function(t) {
    return 1 + (--t) * t * t * t * t
  },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function(t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
  }
}