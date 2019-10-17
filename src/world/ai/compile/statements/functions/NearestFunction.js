import FunctionExpression from './FunctionExpression'
import ObjectTypeLiteral from '../literals/ObjectTypeLiteral'
import ExpressionValue from '../ExpressionValue'
import ObjectType from '../../../../objects/ObjectType'
import Bonfire from '../../../../objects/Bonfire'
import Cauldron from '../../../../objects/Cauldron'
import TerrainType from '../../../../map/TerrainType'
import PathFinder from '../../../PathFinder'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class SetFunction extends FunctionExpression {
  constructor(parent, line, column) {
    super('NearestFunction', parent, line, column)
  }

  getParamTypes() {
    return [
      [{
        type: ObjectTypeLiteral,
        validator: ObjectTypeLiteral.notNothingValidator,
      }]
    ]
  }

  computeValue(context) {
    let value = ExpressionValue.objectType(ObjectType.nothing)
    let objectType = this.params[0].computeValue(context).value
    let object = this.findNearestObject(objectType, context.character, context.world)
    if (object) {
      value = ExpressionValue.object(object.shallowCopy())
    }
    context.calculation.type = 'set'
    context.calculation.operands.push({
      type: 'value',
      value: value,
    })
    return value
  }

  findNearestObject(objectType, character, world) {
    const collides = (x, y) => {
      let terrainType = world.map.getTerrainTypeAt(x, y)
      let collidesTerrain = terrainType === TerrainType.wall || terrainType === TerrainType.hole
      let collidingObjects = world.getWorldObjectsAt(x, y).filter(o => o instanceof Bonfire || o instanceof Cauldron)

      return collidesTerrain || collidingObjects.length > 0
    }
    const pathFinder = new PathFinder(collides, world.map.width, world.map.height)

    let selectedObjects = world.getWorldObjects().filter(o => o.getObjectType() === objectType && o.id !== character.id)
    let paths = selectedObjects.map(object => ({
      object: object,
      path: pathFinder.findPath({
        x: character.x,
        y: character.y,
      }, {
        x: object.x,
        y: object.y,
      })
    }))

    let shortestPath = paths.reduce((acc, path) => path.path.length > 0 && (!acc || path.path.length < acc.path.length) ? path : acc, null)

    return shortestPath && shortestPath.object
  }

  onInvalidNumberOfParams(rawParams, config, context) {
    throw new InvalidNumberOfParamsException('\'nearest\' function requires exactly 1 ObjectTypeLiteral parameter', this, {
      template: 'exception_invalid_params_one_object_type_param_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        allowedValues: config.objectTypes.filter(ObjectTypeLiteral.notNothingValidator),
      }
    })
  }

  onInvalidParam(index, param, config, context) {
    throw new InvalidFunctionParamsException(`\'nearest\' function requires 1 parameter of type ObjectTypeLiteral`, param, {
      template: 'exception_invalid_object_type_param_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        param: param.code.join(' ').trim(),
        allowedValues: config.objectTypes.filter(ObjectTypeLiteral.notNothingValidator),
      }
    })
  }

  onParamValidationFailed(param, config) {
    throw new InvalidFunctionParamsException(`'the '${this.constructor.keyword}' function does not accept 'nothing' param as an object type`, param, {
      template: 'exception_invalid_object_type_param_not_nothing_template',
      values: {
        keyword: {
          template: `function_${this.constructor.keyword}`
        },
        param: param.code.join(' ').trim(),
        allowedValues: config.objectTypes.filter(ObjectTypeLiteral.notNothingValidator),
      }
    })
  }
}

SetFunction.keyword = 'nearest'