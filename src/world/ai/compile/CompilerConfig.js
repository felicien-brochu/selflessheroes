import EmptyStatement from './statements/EmptyStatement'
import AssignStatement from './statements/AssignStatement'
import IfStatement from './statements/IfStatement'
import ElseStatement from './statements/ElseStatement'
import EndIfStatement from './statements/EndIfStatement'
import JumpStatement from './statements/JumpStatement'
import AnchorStatement from './statements/AnchorStatement'
import BooleanExpression from './statements/BooleanExpression'
import ActionFunctions from './statements/functions/ActionFunctions'
import SetFunction from './statements/functions/SetFunction'
import CalcFunction from './statements/functions/CalcFunction'
import StepOnceFunction from './statements/functions/StepOnceFunction'
import StepFunction from './statements/functions/StepFunction'
import FireBallFunction from './statements/functions/FireBallFunction'
import TakeFunction from './statements/functions/TakeFunction'
import DropFunction from './statements/functions/DropFunction'
import WriteFunction from './statements/functions/WriteFunction'
import VariableIdentifier from './statements/VariableIdentifier'
import ObjectTypeLiteral from './statements/literals/ObjectTypeLiteral'
import TerrainTypeLiteral from './statements/literals/TerrainTypeLiteral'
import DirectionLiteral from './statements/literals/DirectionLiteral'
import IntegerLiteral from './statements/literals/IntegerLiteral'
import MyItemLiteral from './statements/literals/MyItemLiteral'
import ObjectType from '../../ObjectType'
import TerrainType from '../../TerrainType'

const primaryStatementMap = {
  empty: EmptyStatement,
  assign: AssignStatement,
  if: IfStatement,
  else: ElseStatement,
  endif: EndIfStatement,
  jump: JumpStatement,
  anchor: AnchorStatement
}

const terrainTypeMap = {
  wall: 'wall',
  hole: 'hole',
  floor: 'floor',
  void: 'void'
}

const objectTypeMap = {
  hero: 'hero',
  switch: 'switch',
  bonfire: 'bonfire',
  egg: 'egg'
}

const valueFunctionMap = {
  set: SetFunction,
  calc: CalcFunction
}

const actionFunctionMap = {
  step_once: StepOnceFunction,
  step: StepFunction,
  fireball: FireBallFunction,
  take: TakeFunction,
  drop: DropFunction,
  write: WriteFunction
}

const comparisonExpressionMap = {
  terrain_type: TerrainTypeLiteral,
  object_type: ObjectTypeLiteral,
  direction: DirectionLiteral,
  integer: IntegerLiteral,
  variable: VariableIdentifier,
  myitem: MyItemLiteral
}

export default class CompilerConfig {
  constructor({
    excludePrimary = [],
    variables = 3,
    terrainTypes = [],
    objectTypes = [],
    valueFunctions = [],
    actionFunctions = [],
    leftComparisonExpressions = [],
    rightComparisonExpressions = []
  }) {
    this.primaryStatements = []
    for (let key in primaryStatementMap) {
      if (excludePrimary.indexOf(key) < 0) {
        this.primaryStatements.push(primaryStatementMap[key])
      }
    }

    this.variables = variables
    this.terrainTypes = terrainTypes.map(key => terrainTypeMap[key])
    this.objectTypes = objectTypes.map(key => objectTypeMap[key])
    this.valueFunctions = valueFunctions.map(key => valueFunctionMap[key])
    this.actionFunctions = actionFunctions.map(key => actionFunctionMap[key])
    this.leftComparisonExpressions = leftComparisonExpressions.map(key => comparisonExpressionMap[key])
    this.rightComparisonExpressions = rightComparisonExpressions.map(key => comparisonExpressionMap[key])
  }

  static getDefault() {
    return new CompilerConfig({
      excludePrimary: [],
      variables: 3,
      terrainTypes: [
        'wall',
        'hole',
        'floor'
      ],
      objectTypes: [
        'hero',
        'switch',
        'bonfire',
        'egg'
      ],
      valueFunctions: [
        'set',
        'calc'
      ],
      actionFunctions: [
        'step',
        'fireball',
        'take',
        'drop',
        'write'
      ],
      leftComparisonExpressions: [
        'direction',
        'myitem',
        'variable'
      ],
      rightComparisonExpressions: [
        'terrain_type',
        'object_type',
        'direction',
        'integer',
        'myitem',
        'variable'
      ]
    })
  }

  getAllowedVariableIdentifiers() {
    let names = []
    for (let i = 0; i < this.variables; i++) {
      names.push(String.fromCharCode(0x61 + i))
    }
    return names
  }

  getAllowedPrimaryStatements() {
    return this.primaryStatements.concat(this.actionFunctions)
  }

  getPrimaryStatements() {
    let functions = []
    for (let key in ActionFunctions) {
      functions.push(ActionFunctions[key])
    }
    return this.primaryStatements.concat(functions)
  }
}