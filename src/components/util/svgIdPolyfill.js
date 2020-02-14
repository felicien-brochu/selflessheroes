import {
  isSafari
} from 'get-browser'

function isBrowserUsingBaseURLForSVGIds() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || isSafari()
}

export default function(id, baseURL) {
  if (isBrowserUsingBaseURLForSVGIds()) {
    return `url(${baseURL}${id})`
  }

  return `url(${id})`
}