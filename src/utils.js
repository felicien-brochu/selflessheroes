export function propertiesToObject(properties) {
  let o = {}
  for (let property of properties) {
    o[property.name] = property.value
  }
  return o
}