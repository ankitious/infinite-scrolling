export function isObject(obj) {
  return !!obj && Object.prototype.toString.call(obj) === "[object Object]";
}
