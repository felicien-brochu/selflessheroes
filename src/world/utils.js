export function namedPropertiesToObject(properties) {
  let o = {}
  for (let property of properties) {
    o[property.name] = property.value
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