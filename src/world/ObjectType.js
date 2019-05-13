export default class ObjectType {}

ObjectType.hero = Symbol('heroType')
ObjectType.switch = Symbol('switchType')
ObjectType.bonfire = Symbol('bonfireType')

Object.freeze(ObjectType)