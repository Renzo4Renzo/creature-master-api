function removeSpecificArrayItem(array, value) {
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
}

module.exports = {
  removeSpecificArrayItem,
};
