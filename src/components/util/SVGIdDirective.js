import {
  isSafari
} from 'get-browser'

export default function(el, binding, node) {
  if (binding.value === binding.oldValue) {
    return
  }

  const baseURL = node.context.$router.currentRoute.fullPath

  let attr = binding.value.attr
  let id = binding.value.id

  if (binding.modifiers.url) {
    id = svgIdURLPolyfill(id, baseURL)
  } else {
    id = svgIdPolyfill(id, baseURL)
  }

  el.setAttribute(attr, id)
}

function isBrowserUsingBaseURLForSVGIds() {
  return !IS_ELECTRON && (/AppleWebKit/.test(navigator.userAgent) || isSafari())
}

function svgIdPolyfill(id, baseURL) {
  if (isBrowserUsingBaseURLForSVGIds()) {
    return `${baseURL}${id}`
  }

  return id
}

function svgIdURLPolyfill(id, baseURL) {
  return `url(${svgIdPolyfill(id, baseURL)})`
}

export {
  svgIdURLPolyfill,
  svgIdPolyfill
}