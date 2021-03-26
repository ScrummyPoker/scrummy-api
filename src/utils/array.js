const filterArray = (array, object, key) => {
  var index = array.findIndex(o => o[key] === object[key]);
  if (index === -1) array.push(object);
  else array.splice(index, 1);
  return array;
}

module.exports = {
  filterArray
}