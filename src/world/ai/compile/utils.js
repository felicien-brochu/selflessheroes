import escapeStringRegexp from 'escape-string-regexp'
import InvalidExpression from './statements/InvalidExpression'
import UndefinedLiteral from './statements/literals/UndefinedLiteral'

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

export function splitCode(code, delimiter, line, column) {
  let limitPositions = indexOfStringInLines(delimiter, code)
  let position = limitPositions[0]

  let code1 = code.slice(0, position.start.line + 1)
  let code2 = code.slice(position.end.line)

  code1[code1.length - 1] = code1[code1.length - 1].substring(0, position.start.column)
  code2[0] = code2[0].substring(position.end.column)

  let col = position.end.column
  if (position.end.line === 0) {
    col += column
  }

  return [{
    code: code1,
    line: line,
    column: column
  }, {
    code: code2,
    line: line + position.end.line,
    column: col
  }]
}

export function subCode(code, startLine, startColumn, endLine, endColumn) {
  let subcode = []
  for (let i = startLine; i <= endLine; i++) {
    let line = code[i]
    if (i === startLine) {
      line = line.substring(startColumn)
    }
    if (i === endLine) {
      line = line.substring(0, line.length - (code[i].length - endColumn))
    }
    subcode.push(line)
  }
  return subcode
}

export function createUnitExpression(code, expressionClasses, parent, line, column) {
  expressionClasses = expressionClasses.slice(0)
  expressionClasses.push(UndefinedLiteral)

  let expression = null
  let joinedCode = code.join(' ')
  for (let expressionClass of expressionClasses) {
    if (expressionClass.isValid(joinedCode)) {
      expression = new expressionClass(parent, line, column)
      break
    }
  }

  if (!expression) {
    expression = new InvalidExpression(parent, line, column)
  }

  expression.pushLines(code)
  return expression
}

export function extractParams(paramsJoinedCode, functionCode, line, column) {
  let params = []
  if (paramsJoinedCode.trim().length > 0) {
    let position = indexOfStringInLines(paramsJoinedCode, functionCode)
    let code = subCode(functionCode, position[0].start.line, position[0].start.column, position[0].end.line, position[0].end.column)
    let codeSplit = [{}, {
      code: code,
      line: line + position[0].start.line,
      column: position[0].start.line === 0 ? column + position[0].start.column : position[0].start.column
    }]

    while (codeSplit[1].code.join(' ').includes(',')) {
      codeSplit = splitCode(codeSplit[1].code, ',', codeSplit[1].line, codeSplit[1].column)

      params.push({
        code: codeSplit[0].code,
        line: codeSplit[0].line,
        column: codeSplit[0].column
      })
    }

    params.push({
      code: codeSplit[1].code,
      line: codeSplit[1].line,
      column: codeSplit[1].column
    })
  }

  return params
}