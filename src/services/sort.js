const { removeSpecificArrayItem } = require("../services/array");

function createSortQuery(filters, model) {
  const { sortBy, sortOrder } = filters;
  let sortingFilter = sortBy || "name";

  const availableFilters = Object.keys(model.schema.paths);
  removeSpecificArrayItem(availableFilters, "_id");

  const isValidSortingFilter = availableFilters.includes(sortingFilter);
  if (isValidSortingFilter === false) {
    throw new Error(`${sortingFilter} is not a valid sortBy`);
  }

  let sortingOrder = sortOrder || "asc";
  if (sortingOrder !== "asc" && sortingOrder !== "desc") {
    throw new Error(`${sortingOrder} is not a valid sortOrder`);
  }

  let sortQuery = {};
  if (sortingOrder === "asc") sortQuery[sortingFilter] = 1;
  else sortQuery[sortingFilter] = -1;
  return sortQuery;
}

module.exports = { createSortQuery };
