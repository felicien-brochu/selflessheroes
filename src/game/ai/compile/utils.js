import escapeStringRegexp from 'escape-string-regexp'
import InvalidExpression from './statements/InvalidExpression'

export function indexOfStringInLines(str, lines) {
  let joinedLines = lines.join(' ')
  let regexp = new RegExp(escapeStringRegexp(str), 'g')
  let matches = []
  let match
  while ((match = regexp.exec(joinedLines)) !== null) {
    matches.push(match)
  }

  let res = []

  for (let match of matches) {
    let startLine = -1
    let startCol = -1
    let endLine = -1
    let endCol = -1
    let length = 0

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      let newLength = length + line.length + 1

      if (match.index < newLength && startLine < 0) {
        startLine = i
        startCol = match.index - length
      }

      if (match.index + str.length < newLength && endLine < 0) {
        endLine = i
        endCol = match.index + str.length - length
      }
      length = newLength
    }

    res.push({
      start: {
        line: startLine,
        column: startCol
      },
      end: {
        line: endLine,
        column: endCol
      }
    })
  }
  return res
}

export function createUnitExpression(code, expressionClasses, line, column) {
  let expression = null
  let joinedCode = code.join(' ')
  for (let expressionClass of expressionClasses) {
    if (expressionClass.isValid(joinedCode)) {
      expression = new expressionClass(line, column)
      break
    }
  }

  if (!expression) {
    expression = new InvalidExpression(line, column)
  }

  expression.pushLines(code)
  return expression
}