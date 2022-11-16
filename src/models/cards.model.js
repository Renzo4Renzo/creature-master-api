const cards = require("./cards.schema");
const { createFilterQuery } = require("../services/filter");
const { createSortQuery } = require("../services/sort");
const { validateBody } = require("../services/body");
const { validateCard } = require("../services/validate-card");

const {
  SAVED_SUCCESSFUL_MESSAGE,
  SAVED_FAILURE_MESSAGE,
  UPDATED_SUCCESSFUL_MESSAGE,
  UPDATED_FAILURE_MESSAGE,
  DELETED_SUCCESSFUL_MESSAGE,
  DELETED_FAILURE_MESSAGE,
} = require("../services/global");

async function postCard(card) {
  const validateBodyResult = await validateBody(card, cards, "POST");
  if (validateBodyResult !== undefined) {
    return validateBodyResult;
  }

  const existingCard = await getCard(card.name);
  if (existingCard.errors === undefined) {
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
    const { _doc: cardData } = await cardToSave.save();
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
  const singleCard = await cards.findOne({ name: name, deletedAt: { $exists: false } }, { _id: 0 }).lean();
  if (singleCard === null) {
    return { errors: `There is no card with the name '${name}'` };
  } else return singleCard;
}

async function patchCard(fieldsToUpdate, name) {
  const validateBodyResult = await validateBody(fieldsToUpdate, cards, "PATCH");
  if (validateBodyResult !== undefined) {
    return validateBodyResult;
  }

  const card = await getCard(name);
  if (card.errors !== undefined) {
    return { message: UPDATED_FAILURE_MESSAGE, errors: card.errors };
  }

  Object.assign(card, fieldsToUpdate);
  delete card._id;
  delete card.createdAt;
  delete card.updatedAt;

  const validateResult = validateCard(card, "PATCH");
  if (validateResult !== undefined) {
    return validateResult;
  }

  const patchResult = await updateCard(card, name);
  return patchResult;
}

async function updateCard(card, name) {
  try {
    let cardToValidate = new cards(card);
    await cardToValidate.validate();
    let cardToUpdate = cardToValidate._doc;
    delete cardToUpdate._id;
    const cardData = await cards.findOneAndUpdate({ name: name }, cardToUpdate, { new: true }).lean();
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

async function deleteCard(name) {
  try {
    const cardToDelete = await getCard(name);
    if (cardToDelete.errors !== undefined) {
      return { message: DELETED_FAILURE_MESSAGE, errors: cardToDelete.errors };
    }
    const deletedCard = await cards.findOneAndUpdate({ name: name }, { deletedAt: new Date() }, { new: true }).lean();
    delete deletedCard._id;
    return { message: DELETED_SUCCESSFUL_MESSAGE, data: deletedCard };
  } catch (error) {
    return { message: DELETED_FAILURE_MESSAGE, errors: error.errors };
  }
}

module.exports = {
  postCard,
  getFilteredCards,
  countCards,
  getCard,
  patchCard,
  deleteCard,
};
