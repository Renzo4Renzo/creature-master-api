const { setErrorMessageByHttpMethod } = require("../services/error-message");

const VALIDATE_FIELD_BOOST_FIELDS_SUCCESSFUL_MESSAGE = "validateFieldBoostFields successful!";
const VALIDATE_CREATURE_FIELDS_SUCCESSFUL_MESSAGE = "validateCreatureFields successful!";

function validateCreatureFields(card) {
  let creatureFieldErrors = [];
  if (card.guild !== undefined) {
    creatureFieldErrors.push(`guild is not valid on ${card.type} Cards!`);
  }
  if (card.trait !== undefined) {
    creatureFieldErrors.push(`trait is not valid on ${card.type} Cards!`);
  }
  if (card.weight !== undefined) {
    creatureFieldErrors.push(`weight is not valid on ${card.type} Cards!`);
  }
  if (card.lifePoints !== undefined) {
    creatureFieldErrors.push(`lifePoints is not valid on ${card.type} Cards!`);
  }
  if (creatureFieldErrors.length > 0) {
    return creatureFieldErrors;
  } else return VALIDATE_CREATURE_FIELDS_SUCCESSFUL_MESSAGE;
}

function validateFieldBoostFields(card) {
  if (card.turns !== undefined) {
    return `turns is not valid for ${card.type} Cards!`;
  }
  return VALIDATE_FIELD_BOOST_FIELDS_SUCCESSFUL_MESSAGE;
}

function validateCard(card, httpMethod) {
  let resultValidateCreatureFields;
  let resultValidateFieldBoostFields;
  let errorMessage;

  switch (card.type) {
    case "Creature":
      resultValidateCreatureFields = VALIDATE_CREATURE_FIELDS_SUCCESSFUL_MESSAGE;
      resultValidateFieldBoostFields = validateFieldBoostFields(card);
      break;
    case "Field Boost":
      resultValidateCreatureFields = validateCreatureFields(card);
      resultValidateFieldBoostFields = VALIDATE_FIELD_BOOST_FIELDS_SUCCESSFUL_MESSAGE;
      break;
    case "Quick Boost":
      resultValidateCreatureFields = validateCreatureFields(card);
      resultValidateFieldBoostFields = validateFieldBoostFields(card);
      break;
    default:
      errorMessage = setErrorMessageByHttpMethod(httpMethod);
      return { message: errorMessage, errors: `${card.type} is not a valid type!` };
  }

  let resultValidateArray = [];
  if (resultValidateCreatureFields !== VALIDATE_CREATURE_FIELDS_SUCCESSFUL_MESSAGE) {
    resultValidateCreatureFields.forEach((error) => resultValidateArray.push(error));
  }
  if (resultValidateFieldBoostFields !== VALIDATE_FIELD_BOOST_FIELDS_SUCCESSFUL_MESSAGE) {
    resultValidateArray.push(resultValidateFieldBoostFields);
  }
  if (resultValidateArray.length > 0) {
    errorMessage = setErrorMessageByHttpMethod(httpMethod);
    return { message: errorMessage, errors: resultValidateArray };
  }
}

module.exports = {
  validateCreatureFields,
  validateFieldBoostFields,
  validateCard,
};
