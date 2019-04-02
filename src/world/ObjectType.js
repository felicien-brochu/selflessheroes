export default class ObjectType {}

ObjectType.hero = Symbol('heroType')
ObjectType.objective = Symbol('objectiveType')

Object.freeze(ObjectType)