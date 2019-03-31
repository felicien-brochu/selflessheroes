import AIFactory from './AIFactory'
import CompilerConfig from './CompilerConfig'
import InvalidStatement from './statements/InvalidStatement'

export default class Compiler {
  constructor(code, config = CompilerConfig.getDefaultConfig()) {
    this.code = code
    this.code = 'a:  \nstep(n)\na = dir(s)\n\t \n  if b == 3 &&\n\t 4 < \n\n3\n\t ||1>dir( n ):\nelse\na = 9\n\tstep(n, s)\nendif\njump a\n'
    this.config = config
    this.statements = []
  }

  compile() {
    console.log("COMPILE CODE: \n", this.code)
    console.log("With config: \n", this.config)
    try {
      let lines = this.code.split(/\r?\n/)
      let currentStatement = null

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if (!currentStatement) {
          for (let statementClass of this.config.statements) {
            if (statementClass.matchLine(lines[i])) {
              currentStatement = new statementClass(i)
              break
            }
          }
        }

        if (currentStatement === null) {
          currentStatement = new InvalidStatement(i)
        }

        currentStatement.pushLine(line)
        if (currentStatement.isCodeComplete()) {
          currentStatement.compile(this.config)
          console.log(currentStatement)
          this.statements.push(currentStatement)
          currentStatement = null
        }
      }
    } catch (e) {
      console.error(e)
    }

    return new AIFactory()
  }
}