const { removeSpecificArrayItem } = require("./array");

function createFilterQuery(filters, model) {
  let requestFilters = {};
  for (const filter in filters) {
    requestFilters[filter] = filters[filter];
  }
  delete requestFilters.page;
  delete requestFilters.pageSize;
  delete requestFilters.sortBy;
  delete requestFilters.sortOrder;

  const availableFilters = Object.keys(model.schema.paths);
  removeSpecificArrayItem(availableFilters, "_id");
  removeSpecificArrayItem(availableFilters, "createdAt");
  removeSpecificArrayItem(availableFilters, "updatedAt");
  removeSpecificArrayItem(availableFilters, "deletedAt");

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
  findQuery.deletedAt = { $exists: false };
  return findQuery;
}

module.exports = { createFilterQuery };
