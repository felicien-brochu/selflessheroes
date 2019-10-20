import EmptyStatement from './statements/EmptyStatement'
import AssignStatement from './statements/AssignStatement'
import IfStatement from './statements/IfStatement'
import ElseStatement from './statements/ElseStatement'
import EndIfStatement from './statements/EndIfStatement'
import JumpStatement from './statements/JumpStatement'
import AnchorStatement from './statements/AnchorStatement'
import ActionStatement from './statements/ActionStatement'
import BooleanExpression from './statements/BooleanExpression'
import ActionFunctions from './statements/functions/ActionFunctions'
import SetFunction from './statements/functions/SetFunction'
import CalcFunction from './statements/functions/CalcFunction'
import NearestFunction from './statements/functions/NearestFunction'
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

import ObjectType from '../../objects/ObjectType'
import TerrainType from '../../map/TerrainType'

const primaryStatementMap = {
  empty: EmptyStatement,
  assign: AssignStatement,
  if: IfStatement,
  else: ElseStatement,
  endif: EndIfStatement,
  jump: JumpStatement,
  anchor: AnchorStatement,
  action: ActionStatement,
}

const terrainTypeMap = {
  wall: 'wall',
  hole: 'hole',
  floor: 'floor',
  void: 'void',
}

const objectTypeMap = {
  nothing: 'nothing',
  hero: 'hero',
  npc: 'npc',
  switch: 'switch',
  bonfire: 'bonfire',
  cauldron: 'cauldron',
  spikes: 'spikes',
  egg: 'egg',
}

const valueFunctionMap = {
  set: SetFunction,
  calc: CalcFunction,
  nearest: NearestFunction,
}

const actionFunctionMap = {
  step_once: StepOnceFunction,
  step: StepFunction,
  fireball: FireBallFunction,
  take: TakeFunction,
  drop: DropFunction,
  write: WriteFunction,
}

const comparisonExpressionMap = {
  terrain_type: TerrainTypeLiteral,
  object_type: ObjectTypeLiteral,
  direction: DirectionLiteral,
  integer: IntegerLiteral,
  variable: VariableIdentifier,
  myitem: MyItemLiteral,
}

export default class CompilerConfig {
  constructor({
    excludePrimary = [],
    variables = 0,
    minInteger = 0,
    maxInteger = 99,
    terrainTypes = [],
    objectTypes = [],
    valueFunctions = [],
    actionFunctions = [],
    leftComparisonExpressions = [],
    rightComparisonExpressions = []
  }) {
    this.allowedPrimaryStatements = []
    for (let key in primaryStatementMap) {
      if (excludePrimary.indexOf(key) < 0) {
        this.allowedPrimaryStatements.push(primaryStatementMap[key])
      }
    }

    this.variables = variables
    this.minInteger = minInteger
    this.maxInteger = maxInteger
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
      minInteger: 0,
      maxInteger: 99,
      terrainTypes: [
        'wall',
        'hole',
        'floor',
      ],
      objectTypes: [
        'hero',
        'switch',
        'bonfire',
        'cauldron',
        'spikes',
        'egg',
        'nothing',
      ],
      valueFunctions: [
        'set',
        'calc',
        'nearest',
      ],
      actionFunctions: [
        'step',
        'fireball',
        'take',
        'drop',
        'write',
      ],
      leftComparisonExpressions: [
        'direction',
        'myitem',
        'variable',
      ],
      rightComparisonExpressions: [
        'terrain_type',
        'object_type',
        'direction',
        'integer',
        'myitem',
        'variable',
      ]
    })
  }

  static getKnownFunctions() {
    let knownFunctions = []
    for (let funcKey in valueFunctionMap) {
      if (valueFunctionMap.hasOwnProperty(funcKey)) {
        knownFunctions.push(valueFunctionMap[funcKey])
      }
    }
    for (let funcKey in actionFunctionMap) {
      if (actionFunctionMap.hasOwnProperty(funcKey)) {
        knownFunctions.push(actionFunctionMap[funcKey])
      }
    }
    return knownFunctions
  }

  getAllowedVariableIdentifiers() {
    let names = []
    for (let i = 0; i < this.variables; i++) {
      names.push('$' + String.fromCharCode(0x61 + i))
    }
    return names
  }

  getAllowedPrimaryStatements() {
    return this.allowedPrimaryStatements
  }

  getPrimaryStatements() {
    let primaryStatements = []
    for (let key in primaryStatementMap) {
      primaryStatements.push(primaryStatementMap[key])
    }
    return primaryStatements
  }

  isParamTypeAvailable(type) {
    return (type.type === TerrainTypeLiteral && this.terrainTypes.length > 0) ||
      (type.type === ObjectTypeLiteral && this.objectTypes.length > 0) ||
      (type.type === VariableIdentifier && this.variables > 0) ||
      type.type === DirectionLiteral ||
      type.type === IntegerLiteral ||
      type.type === MyItemLiteral
  }

  filterParamTypes(types) {
    return types.filter(type => this.isParamTypeAvailable(type))
  }
}