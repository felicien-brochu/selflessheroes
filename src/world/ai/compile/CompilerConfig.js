import EmptyStatement from './statements/EmptyStatement'
import AssignStatement from './statements/AssignStatement'
import IfStatement from './statements/IfStatement'
import ElseStatement from './statements/ElseStatement'
import EndIfStatement from './statements/EndIfStatement'
import JumpStatement from './statements/JumpStatement'
import CloneStatement from './statements/CloneStatement'
import AnchorStatement from './statements/AnchorStatement'
import ActionStatement from './statements/ActionStatement'
import BooleanExpression from './statements/BooleanExpression'

import SetFunction from './statements/functions/SetFunction'
import CalcFunction from './statements/functions/CalcFunction'
import NearestFunction from './statements/functions/NearestFunction'
import StepOnceFunction from './statements/functions/StepOnceFunction'
import StepFunction from './statements/functions/StepFunction'
import FireBallFunction from './statements/functions/FireBallFunction'
import TakeFunction from './statements/functions/TakeFunction'
import DropFunction from './statements/functions/DropFunction'
import WriteFunction from './statements/functions/WriteFunction'
import TellFunction from './statements/functions/TellFunction'
import ListenFunction from './statements/functions/ListenFunction'

import VariableIdentifier from './statements/VariableIdentifier'
import ObjectTypeLiteral from './statements/literals/ObjectTypeLiteral'
import TerrainTypeLiteral from './statements/literals/TerrainTypeLiteral'
import DirectionLiteral from './statements/literals/DirectionLiteral'
import IntegerLiteral from './statements/literals/IntegerLiteral'
import MyItemLiteral from './statements/literals/MyItemLiteral'
import EveryoneLiteral from './statements/literals/EveryoneLiteral'
import ArithmeticOperatorLiteral from './statements/literals/ArithmeticOperatorLiteral'
import MessageLiteral, {
  messages as knownMessages
} from './statements/literals/MessageLiteral'

import ObjectType from '../../objects/ObjectType'
import TerrainType from '../../map/TerrainType'

const primaryStatementMap = {
  empty: EmptyStatement,
  assign: AssignStatement,
  if: IfStatement,
  else: ElseStatement,
  endif: EndIfStatement,
  jump: JumpStatement,
  clone: CloneStatement,
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
  tell: TellFunction,
  listen: ListenFunction,
}

const expressionsMap = {
  terrain_type: TerrainTypeLiteral,
  object_type: ObjectTypeLiteral,
  direction: DirectionLiteral,
  integer: IntegerLiteral,
  variable: VariableIdentifier,
  myitem: MyItemLiteral,
  everyone: EveryoneLiteral,
  message: MessageLiteral,
}

export default class CompilerConfig {
  constructor({
    excludePrimary = [],
    cloneIsDeadly = false,
    variables = 0,
    minInteger = 0,
    maxInteger = 99,
    messages = 0,
    terrainTypes = [],
    objectTypes = [],
    valueFunctions = [],
    actionFunctions = [],
    leftComparisonExpressions = [],
    rightComparisonExpressions = [],
    forbiddenExpressions = [],
  }) {
    this.allowedPrimaryStatements = []
    for (let key in primaryStatementMap) {
      if (excludePrimary.indexOf(key) < 0) {
        this.allowedPrimaryStatements.push(primaryStatementMap[key])
      }
    }

    this.cloneIsDeadly = cloneIsDeadly
    this.variables = variables
    this.minInteger = minInteger
    this.maxInteger = maxInteger
    this.messages = messages
    this.terrainTypes = terrainTypes.map(key => terrainTypeMap[key])
    this.objectTypes = objectTypes.map(key => objectTypeMap[key])
    this.valueFunctions = valueFunctions.map(key => valueFunctionMap[key])
    this.actionFunctions = actionFunctions.map(key => actionFunctionMap[key])
    this.leftComparisonExpressions = leftComparisonExpressions.map(key => expressionsMap[key])
    this.rightComparisonExpressions = rightComparisonExpressions.map(key => expressionsMap[key])
    this.forbiddenExpressions = forbiddenExpressions.map(key => expressionsMap[key])

    if (this.forbiddenExpressions.includes(TerrainTypeLiteral)) {
      this.terrainTypes = []
    }
    if (this.forbiddenExpressions.includes(ObjectTypeLiteral)) {
      this.objectTypes = []
    }
    if (this.forbiddenExpressions.includes(VariableIdentifier)) {
      this.variables = 0
    }
    if (this.forbiddenExpressions.includes(MessageLiteral)) {
      this.messages = 0
    }
  }

  static getDefault() {
    return new CompilerConfig({
      excludePrimary: [],
      cloneIsDeadly: false,
      variables: 3,
      minInteger: 0,
      maxInteger: 99,
      messages: 8,
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
        'step_once',
        'fireball',
        'take',
        'drop',
        'write',
        'tell',
        'listen',
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
      ],
      forbiddenExpressions: [],
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

  getAllowedMessageLiterals() {
    return knownMessages.slice(0, this.messages)
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

  isExpressionTypeAvailable(type) {
    return !this.forbiddenExpressions.includes(type) &&
      !(type === VariableIdentifier && this.variables === 0) &&
      !(type === TerrainTypeLiteral && this.terrainTypes.length === 0) &&
      !(type === ObjectTypeLiteral && this.objectTypes.length === 0) &&
      !(type === MessageLiteral && this.messages === 0)
  }

  filterParamTypes(types) {
    return types.filter(type => this.isExpressionTypeAvailable(type.type))
  }
}