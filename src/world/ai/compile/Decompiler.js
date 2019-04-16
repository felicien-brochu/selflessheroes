import CompilerConfig from './CompilerConfig'

export default class Decompiler {
  constructor(statements, config = CompilerConfig.getDefaultConfig()) {
    this.statements = statements
    this.code = ''
    this.config = config
    this.executable = false
    this.exception = null
  }

  decompile() {
    let line = 0
    let indent = 0
    this.executable = true
    this.code = ''
    try {
      for (let statement of this.statements) {
        indent += statement.getBeforeIndent()

        this.executable &= statement.decompile(indent, line, 0)
        line = statement.line + statement.code.length

        indent += statement.getAfterIndent()

        for (let codeLine of statement.code) {
          if (this.code !== '') {
            this.code += '\n'
          }
          this.code += codeLine
        }
      }
    } catch (e) {
      this.exception = e
      this.executable = false
    }
  }
}