const { removeSpecificArrayItem } = require("./array");

function createFilterQuery(filters, model) {
  const requestFilters = filters;
  delete requestFilters.page;
  delete requestFilters.pageSize;

  const availableFilters = Object.keys(model.schema.paths);
  removeSpecificArrayItem(availableFilters, "_id");
  removeSpecificArrayItem(availableFilters, "createdAt");
  removeSpecificArrayItem(availableFilters, "updatedAt");

  const requestKeyFilters = Object.keys(requestFilters);
  const findQuery = {};
  const wrongFilters = [];

  requestKeyFilters.forEach((key) => {
    if (availableFilters.indexOf(key) !== -1) {
      findQuery[key] = requestFilters[key];
    } else wrongFilters.push(`'${key}' is not a valid filter`);
  });

  if (wrongFilters.length > 0) {
    throw new Error(wrongFilters);
  }

  for (const key in findQuery) {
    if (model.schema.paths[key].instance === "String") findQuery[key] = new RegExp(findQuery[key]);
    else if (model.schema.paths[key].instance === "Number") findQuery[key] = Number(findQuery[key]);
  }

  return findQuery;
}

module.exports = { createFilterQuery };
