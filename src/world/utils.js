export function tiledObjectToObject(object) {
  let o = {
    ...object
  }
  if (object.properties !== undefined) {
    delete o.properties
    for (let property of object.properties) {
      o[property.name] = property.value
    }
  }
  return o
}

export function namedObjectListToObject(list) {
  let o = {}
  for (let object of list) {
    o[object.name] = object
  }
  return o
}

export function typedObjectListToObject(list) {
  let o = {}
  for (let object of list) {
    o[object.type] = object
  }
  return o
}