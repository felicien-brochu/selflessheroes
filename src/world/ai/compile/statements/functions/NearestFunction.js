import FunctionExpression from './FunctionExpression'
import ObjectTypeLiteral from '../literals/ObjectTypeLiteral'
import ExpressionValue from '../ExpressionValue'
import ObjectType from '../../../../objects/ObjectType'
import Item from '../../../../objects/Item'
import {
  InvalidNumberOfParamsException,
  InvalidFunctionParamsException
} from '../../CompilerException'

export default class SetFunction extends FunctionExpression {
  constructor(parent, line, column) {
    super('NearestFunction', parent, line, column)
  }

  getRawParamTypes() {
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
    let selectedObjects = world.getWorldObjects().filter(o => o.getObjectType() === objectType && o.id !== character.id && !(o instanceof Item && o.owner))
    let distances = selectedObjects.map(object => ({
      object: object,
      distance: character.distanceFrom(object),
    }))
    let shortestDistance = distances.reduce((acc, dist) => !acc || dist.distance < acc.distance ? dist : acc, null)

    return shortestDistance && shortestDistance.object
  }

  onInvalidNumberOfParams(config) {
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

  onInvalidParam(index, param, config) {
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

  onParamValidationFailed(index, param, config) {
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