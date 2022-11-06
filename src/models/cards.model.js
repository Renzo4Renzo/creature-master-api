const cards = require("./cards.schema");
const { createFilterQuery } = require("../services/filter");

const VALIDATE_FIELD_BOOST_FIELDS_SUCCESSFUL_MESSAGE = "validateFieldBoostFields successful!";
const VALIDATE_CREATURE_FIELDS_SUCCESSFUL_MESSAGE = "validateCreatureFields successful!";
const SAVED_SUCCESSFUL_MESSAGE = "The card was saved successfully!";
const SAVED_FAILURE_MESSAGE = "Could not save the card!";

function validateCreatureFields(card) {
  if (card.guild) {
    return `guild is not valid on ${card.type} Cards!`;
  }
  if (card.trait) {
    return `trait is not valid on ${card.type} Cards!`;
  }
  if (card.weight) {
    return `weight is not valid on ${card.type} Cards!`;
  }
  if (card.lifePoints) {
    return `lifePoints is not valid on ${card.type} Cards!`;
  }
  return VALIDATE_CREATURE_FIELDS_SUCCESSFUL_MESSAGE;
}

function validateFieldBoostFields(card) {
  if (card.turns) {
    return `turns is not valid for ${card.type} Cards!`;
  }
  return VALIDATE_FIELD_BOOST_FIELDS_SUCCESSFUL_MESSAGE;
}

async function postCard(card) {
  const existingCard = await cards.findOne({ name: card.name });

  if (existingCard) {
    return { message: SAVED_FAILURE_MESSAGE, errors: `There is already a card named ${card.name}!` };
  }

  let resultValidateCreatureFields;
  let resultValidateFieldBoostFields;

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
      return { message: SAVED_FAILURE_MESSAGE, errors: `${card.type} is not a valid type!` };
  }

  let resultValidateArray = [];
  if (resultValidateCreatureFields !== VALIDATE_CREATURE_FIELDS_SUCCESSFUL_MESSAGE) {
    resultValidateArray.push(resultValidateCreatureFields);
  }
  if (resultValidateFieldBoostFields !== VALIDATE_FIELD_BOOST_FIELDS_SUCCESSFUL_MESSAGE) {
    resultValidateArray.push(resultValidateFieldBoostFields);
  }
  if (resultValidateArray.length > 0) {
    return { message: SAVED_FAILURE_MESSAGE, errors: resultValidateArray };
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
  const filteredCards = await cards.find(findQuery, { _id: 0 }).sort({ name: 1 }).skip(pageOffset).limit(pageSize);
  return filteredCards;
}

async function getCard(name) {
  const singleCard = await cards.findOne({ name: name }, { _id: 0 });
  if (singleCard === null) {
    throw new Error(`There is no card with the name '${name}'`);
  } else return singleCard;
}

module.exports = {
  postCard,
  getFilteredCards,
  countCards,
  getCard,
};
