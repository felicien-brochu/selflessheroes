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

const allowedExcludePrimary = [
  'if',
  'jump',
  'clone',
  'action',
  'assign'
]

const primaryStatementMap = {
  if: IfStatement,
  else: ElseStatement,
  endif: EndIfStatement,
  jump: JumpStatement,
  clone: CloneStatement,
  anchor: AnchorStatement,
  action: ActionStatement,
  assign: AssignStatement,
  empty: EmptyStatement,
}

const terrainTypeMap = {
  wall: 'wall',
  hole: 'hole',
  floor: 'floor',
  infected: 'infected',
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
  step: StepOnceFunction,
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

function mapKeywordsToTypes(keywords, typesMap, paramName) {
  if (!Array.isArray(keywords)) {
    console.error(`CompilerConfig param ${paramName} is not a valid array. ${paramName} set to [].`)
    keywords = []
  }
  for (let keyword of keywords) {
    if (typeof keyword !== 'string' || !typesMap.hasOwnProperty(keyword)) {
      console.error(`CompilerConfig param ${paramName} contains an unknown keyword: ${keyword}.`)
    }
  }

  // Filter unallowed keywords
  keywords = keywords.filter(keyword => typesMap.hasOwnProperty(keyword))
  // Ensure keywords are unique
  keywords = [...new Set(keywords)]

  return keywords.map(keyword => typesMap[keyword])
}

function controlIntegerParam(param, name, defaultValue, min, max) {
  if (!Number.isInteger(param)) {
    console.error(`CompilerConfig param ${name} is not a valid integer. ${name} set to default value ${defaultValue}.`)
    return defaultValue
  }

  if (Number.isInteger(min) && param < min) {
    console.error(`CompilerConfig param ${name} < ${min}. ${name} set to ${min}.`)
    return min
  }

  if (Number.isInteger(max) && param > max) {
    console.error(`CompilerConfig param ${name} > ${max}. ${name} set to ${max}.`)
    return max
  }

  return param
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
    this.fillAllowedPrimaryStatements(excludePrimary)

    this.cloneIsDeadly = !!cloneIsDeadly

    this.variables = controlIntegerParam(variables, "variables", 0, 0, 26)
    this.minInteger = controlIntegerParam(minInteger, "minInteger", 0)
    this.maxInteger = controlIntegerParam(maxInteger, "maxInteger", 99)
    this.messages = controlIntegerParam(messages, "messages", 0, 0, 8)

    if (this.minInteger > this.maxInteger) {
      console.error(`CompilerConfig params error: minInteger > maxInteger.\n\tminInteger set to default value 0.\n\tmaxInteger set to default value 99.`)
      this.minInteger = 0
      this.maxInteger = 99
    }

    this.terrainTypes = mapKeywordsToTypes(terrainTypes, terrainTypeMap, "terrainTypes")
    this.objectTypes = mapKeywordsToTypes(objectTypes, objectTypeMap, "objectTypes")
    this.valueFunctions = mapKeywordsToTypes(valueFunctions, valueFunctionMap, "valueFunctions")
    this.actionFunctions = mapKeywordsToTypes(actionFunctions, actionFunctionMap, "actionFunctions")
    this.leftComparisonExpressions = mapKeywordsToTypes(leftComparisonExpressions, expressionsMap, "leftComparisonExpressions")
    this.rightComparisonExpressions = mapKeywordsToTypes(rightComparisonExpressions, expressionsMap, "rightComparisonExpressions")
    this.forbiddenExpressions = mapKeywordsToTypes(forbiddenExpressions, expressionsMap, "forbiddenExpressions")

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

    if (!this.allowedPrimaryStatements.includes(ActionStatement)) {
      this.actionFunctions = []
    }
    if (!this.allowedPrimaryStatements.includes(AssignStatement)) {
      this.valueFunctions = []
    }
  }

  fillAllowedPrimaryStatements(excludePrimary) {
    if (!Array.isArray(excludePrimary)) {
      console.error(`CompilerConfig param excludePrimary is not a valid array. excludePrimary set to [].`)
      excludePrimary = []
    }
    for (let keyword of excludePrimary) {
      if (typeof keyword !== 'string' || !allowedExcludePrimary.includes(keyword)) {
        console.error(`CompilerConfig param excludePrimary contains an unknown keyword: ${keyword}.`)
      }
    }
    excludePrimary = excludePrimary.filter(key => allowedExcludePrimary.includes(key))

    if (excludePrimary.includes('if')) {
      excludePrimary.push('else')
      excludePrimary.push('endif')
    }

    if (excludePrimary.includes('jump') && excludePrimary.includes('clone')) {
      excludePrimary.push('anchor')
    }

    for (let key in primaryStatementMap) {
      if (excludePrimary.indexOf(key) < 0) {
        this.allowedPrimaryStatements.push(primaryStatementMap[key])
      }
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
        'step',
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