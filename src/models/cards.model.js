const cards = require("./cards.schema");

const VALIDATE_FIELD_BOOST_FIELDS_SUCCESSFUL_MESSAGE = "validateFieldBoostFields successful!";
const VALIDATE_CREATURE_FIELDS_SUCCESSFUL_MESSAGE = "validateCreatureFields successful!";
const SAVED_SUCCESSFUL_MESSAGE = "Card saved successfully!";
const SAVED_FAILURE_MESSAGE = "Card was not saved!";

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

module.exports = {
  postCard,
};
