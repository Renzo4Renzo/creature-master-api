const { SAVED_FAILURE_MESSAGE, UPDATED_FAILURE_MESSAGE } = require("./global");

//TO DO: This is only working for "cards", it won't work for "decks"
function setErrorMessageByHttpMethod(httpMethod) {
  switch (httpMethod) {
    case "POST":
      return SAVED_FAILURE_MESSAGE;
    case "PATCH":
      return UPDATED_FAILURE_MESSAGE;
    default:
      return undefined;
  }
}

module.exports = { setErrorMessageByHttpMethod };
