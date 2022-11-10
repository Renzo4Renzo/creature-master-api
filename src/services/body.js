const { removeSpecificArrayItem } = require("./array");
const { setErrorMessageByHttpMethod } = require("./error-message");

function validateBody(body, model, httpMethod) {
  const availableFields = Object.keys(model.schema.paths);
  removeSpecificArrayItem(availableFields, "_id");
  removeSpecificArrayItem(availableFields, "createdAt");
  removeSpecificArrayItem(availableFields, "updatedAt");
  let unexistingFieldErrors = [];
  for (const field in body) {
    if (availableFields.indexOf(field) === -1) {
      unexistingFieldErrors.push(`'${field}' is not an available field for this payload!`);
    }
  }
  if (unexistingFieldErrors.length > 0) {
    const errorMessage = setErrorMessageByHttpMethod(httpMethod);
    return { message: errorMessage, errors: unexistingFieldErrors };
  }
}

module.exports = { validateBody };
