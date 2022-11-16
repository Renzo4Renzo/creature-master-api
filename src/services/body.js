const { removeSpecificArrayItem } = require("./array");
const { setErrorMessageByHttpMethod } = require("./error-message");

function validateBody(body, model, httpMethod) {
  const availableFields = Object.keys(model.schema.paths);
  removeSpecificArrayItem(availableFields, "_id");
  if (httpMethod === "PATCH") removeSpecificArrayItem(availableFields, "type"); //TO DO: This is only working for "cards", it won't work for "decks"
  removeSpecificArrayItem(availableFields, "createdAt");
  removeSpecificArrayItem(availableFields, "updatedAt");
  removeSpecificArrayItem(availableFields, "deletedAt");
  let unexistingFieldErrors = [];
  for (const field in body) {
    if (availableFields.indexOf(field) === -1) {
      unexistingFieldErrors.push(`'${field}' is not an available field in this payload!`);
    }
  }
  if (unexistingFieldErrors.length > 0) {
    const errorMessage = setErrorMessageByHttpMethod(httpMethod);
    return { message: errorMessage, errors: unexistingFieldErrors };
  }
}

module.exports = { validateBody };
