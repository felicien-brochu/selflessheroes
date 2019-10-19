export default function textFit(el, options) {
  const maxWidth = options.maxWidth || el.offsetWidth
  const firstLineMax = options.firstLineMax || 20
  const secondLineMax = options.secondLineMax || 16
  const text = el.textContent
  let innerSpan = document.createElement('span');
  innerSpan.style['display'] = 'inline-block';
  innerSpan.innerHTML = text;
  el.innerHTML = '';
  el.appendChild(innerSpan);

  let fontSize = findFontSize(innerSpan, 1, firstLineMax, secondLineMax, maxWidth)
  if (fontSize < 0) {
    fontSize = findFontSize(innerSpan, 2, secondLineMax, 1, maxWidth)
  }
  innerSpan.style.lineHeight = `${secondLineMax}px`
}

function findFontSize(innerSpan, lines, maxFontSize, minFontSize, maxWidth) {
  let high = maxFontSize
  let low = minFontSize
  let mid = parseInt((low + high) / 2, 10)

  // Binary search for best fit
  while (low <= high) {
    mid = parseInt((low + high) / 2, 10)
    innerSpan.style.fontSize = `${mid}px`
    innerSpan.style.lineHeight = `${mid}px`
    if (innerSpan.scrollWidth <= maxWidth && innerSpan.scrollHeight < (lines + 1) * mid) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  if (innerSpan.scrollWidth > maxWidth || innerSpan.scrollHeight > (lines + 1) * mid) {
    return -1
  }

  return mid
}



// function findBreakChars() {
//   var test = document.createElement('div')
//   test.className = 'test'
//   test.style = 'width: 0; line-height: 1px;'
//   document.body.appendChild(test);
//   let softBreakChars = []
//   for (var i = 0; i < 0xff; ++i) {
//     var char = String.fromCharCode(i);
//     test.textContent = 'qdsqfgqdgqsdg' + char + 'qsdfqsdfqsdfqsdf';
//     if (test.clientHeight > 1) {
//       // console.log(i.toString(16) + ': ' + JSON.stringify(char));
//       softBreakChars.push(char)
//     }
//   }
//   document.body.removeChild(test)
//   return softBreakChars
// }
// BreakChars from 0x00 to 0xFF found with the function above
const breakChars = ["\u0000", "\u0001", "\u0002", "\u0003", "\u0004", "\u0005", "\u0006", "\u0007", "\b", "\t", "\n", "\u000b", "\f", "\r", "\u000e", "\u000f", "\u0010", "\u0011", "\u0012", "\u0013", "\u0014", "\u0015", "\u0016", "\u0017", "\u0018", "\u0019", "\u001a", "\u001b", "\u001c", "\u001d", "\u001e", "\u001f", " ", "-", "­"]

function textFitLength(el, options) {
  let text = el.textContent
  let tokens = []
  let searchText = text
  for (let i = 0; i < searchText.length; i++) {
    if (breakChars.some(bc => bc === searchText.charAt(i))) {
      tokens.push(searchText.substring(0, i))
      searchText = searchText.substring(i + 1)
      i = -1
    } else if (i === searchText.length - 1) {
      tokens.push(searchText)
    }
  }

  const startLineLength = 9
  const a = -4
  let lineLength = startLineLength
  let lines
  while ((lines = tryLineLength(lineLength, tokens)) > 2) {
    lineLength++
  }
  let fontSize = a * (lineLength - startLineLength) + 50
  if (lines === 2) {
    fontSize = Math.min(fontSize, 40)
  }
  el.style = `font-size: ${fontSize}px;`
}

function tryLineLength(lineLength, tokens) {
  let lines = 0
  let chars = 0
  let lineTokens = 0
  for (let i = 0; i < tokens.length; i++) {
    if (chars === 0) {
      lines++
    }
    let token = tokens[i]
    chars += token.length
    lineTokens++
    if (chars > lineLength) {
      if (lineTokens !== 1) {
        i--
      }
      chars = 0
      lineTokens = 0
    } else {
      // count space
      chars++
    }
  }
  return lines
}