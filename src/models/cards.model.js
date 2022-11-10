const cards = require("./cards.schema");
const { createFilterQuery } = require("../services/filter");
const { createSortQuery } = require("../services/sort");
const { setErrorMessageByHttpMethod } = require("../services/error-message");

const { validateBody } = require("../services/body");

const VALIDATE_FIELD_BOOST_FIELDS_SUCCESSFUL_MESSAGE = "validateFieldBoostFields successful!";
const VALIDATE_CREATURE_FIELDS_SUCCESSFUL_MESSAGE = "validateCreatureFields successful!";

const {
  SAVED_SUCCESSFUL_MESSAGE,
  SAVED_FAILURE_MESSAGE,
  UPDATED_SUCCESSFUL_MESSAGE,
  UPDATED_FAILURE_MESSAGE,
} = require("../services/global");

function validateCreatureFields(card) {
  let creatureFieldErrors = [];
  if (card.guild) {
    creatureFieldErrors.push(`guild is not valid on ${card.type} Cards!`);
  }
  if (card.trait) {
    creatureFieldErrors.push(`trait is not valid on ${card.type} Cards!`);
  }
  if (card.weight) {
    creatureFieldErrors.push(`weight is not valid on ${card.type} Cards!`);
  }
  if (card.lifePoints) {
    creatureFieldErrors.push(`lifePoints is not valid on ${card.type} Cards!`);
  }
  if (creatureFieldErrors.length > 0) {
    return creatureFieldErrors;
  } else return VALIDATE_CREATURE_FIELDS_SUCCESSFUL_MESSAGE;
}

function validateFieldBoostFields(card) {
  if (card.turns) {
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

async function postCard(card) {
  const validateBodyResult = await validateBody(card, cards, "POST");
  if (validateBodyResult !== undefined) {
    return validateBodyResult;
  }

  const existingCard = await cards.findOne({ name: card.name });

  if (existingCard) {
    return { message: SAVED_FAILURE_MESSAGE, errors: `There is already a card called '${card.name}'!` };
  }

  const validateResult = validateCard(card, "POST");
  if (validateResult !== undefined) {
    return validateResult;
  }

  const saveResult = await saveCard(card);
  return saveResult;
}

async function saveCard(card) {
  try {
    const cardToSave = new cards(card);
    const response = await cardToSave.save();
    const cardData = response._doc;
    delete cardData._id;
    return { message: SAVED_SUCCESSFUL_MESSAGE, data: cardData };
  } catch (error) {
    mappedErrors = error.errors;
    Object.keys(mappedErrors).forEach(function (key) {
      mappedErrors[key] = mappedErrors[key].message;
    });
    return { message: SAVED_FAILURE_MESSAGE, errors: mappedErrors };
  }
}

async function countCards(filters) {
  const findQuery = createFilterQuery(filters, cards);
  const totalDocs = await cards.countDocuments(findQuery);
  return totalDocs;
}

async function getFilteredCards(filters, pageOffset, pageSize) {
  const findQuery = createFilterQuery(filters, cards);
  const sortQuery = createSortQuery(filters, cards);
  const filteredCards = await cards.find(findQuery, { _id: 0 }).sort(sortQuery).skip(pageOffset).limit(pageSize);
  return filteredCards;
}

async function getCard(name) {
  const singleCard = await cards.findOne({ name: name }, { _id: 0 });
  if (singleCard === null) {
    throw new Error(`There is no card with the name '${name}'`);
  } else return singleCard;
}

async function patchCard(fieldsToUpdate, name) {
  //TO DO: Patch should validate that body does not bring unexisting filters. Patch should allow to send 'null' to erase fields from database.
  const result = await cards.findOne({ name: name });
  if (result === null) {
    return { message: UPDATED_FAILURE_MESSAGE, errors: `There is no card in database called '${name}'!` };
  }
  const { _doc: card } = result;
  Object.assign(card, fieldsToUpdate);
  delete card._id;

  const validateResult = validateCard(card, "PATCH");
  if (validateResult !== undefined) {
    return validateResult;
  }

  const patchResult = await updateCard(card, name);
  return patchResult;
}

async function updateCard(card, name) {
  try {
    const response = await cards.findOneAndUpdate({ name: name }, card, { new: true });
    const cardData = response._doc;
    delete cardData._id;
    return { message: UPDATED_SUCCESSFUL_MESSAGE, data: cardData };
  } catch (error) {
    mappedErrors = error.errors;
    Object.keys(mappedErrors).forEach(function (key) {
      mappedErrors[key] = mappedErrors[key].message;
    });
    return { message: UPDATED_FAILURE_MESSAGE, errors: mappedErrors };
  }
}

module.exports = {
  postCard,
  getFilteredCards,
  countCards,
  getCard,
  patchCard,
};
