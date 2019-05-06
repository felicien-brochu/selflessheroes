import textFit from './textFit'

export default function(el, binding) {
  let prefix = binding.value ? binding.value + '-' : ''
  let bbcode = el.innerHTML

  let segments = genSegments(bbcode, prefix)
  let html = ''
  for (let segment of segments) {
    html += `<span class="${segment.classNames.join(' ')}">${segment.text}</span>`
  }
  el.innerHTML = html
}

function genSegments(bbcode, prefix) {
  let strings = bbcode.split('%%')
  let segments = []
  let nextSegment = 1
  for (let i = 0; i < strings.length; i++) {
    let str = strings[i]
    if (i === nextSegment) {
      let sepIndex = str.indexOf('$')
      let type = str.substring(0, sepIndex)
      let code = str.substring(sepIndex + 1)
      segments.push({
        text: code,
        classNames: ['code-segment', `${prefix}${type}`]
      })
      nextSegment += 2
    } else {
      segments.push({
        text: str,
        classNames: ['text-segment']
      })
    }
  }
  return segments
}