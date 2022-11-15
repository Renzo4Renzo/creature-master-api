const { postCard, getFilteredCards, countCards, getCard, patchCard, deleteCard } = require("../../models/cards.model");
const { getPagination } = require("../../services/pagination");

const {
  EMPTY_BODY_ERROR,
  EMPTY_NAME_PARAM_ERROR,
  GET_CARDS_WITH_FILTERS_FAILURE_MESSAGE,
  GET_CARD_SUCCESSFUL_MESSAGE,
  GET_CARD_FAILURE_MESSAGE,
  SAVED_FAILURE_MESSAGE,
  UPDATED_FAILURE_MESSAGE,
  DELETED_FAILURE_MESSAGE,
} = require("../../services/global");

async function httpPostCards(req, res) {
  const card = req.body;

  if (Object.keys(card).length === 0) {
    return res.status(400).json({ message: SAVED_FAILURE_MESSAGE, errors: EMPTY_BODY_ERROR });
  }

  const postResult = await postCard(card);
  if (postResult.errors === undefined) {
    return res.status(201).json({ message: postResult.message, data: postResult.data });
  } else {
    return res.status(400).json(postResult);
  }
}

async function httpGetCardsWithFilters(req, res) {
  try {
    const totalCards = await countCards(req.query);
    const { page, pageSize, pageOffset, totalPages, hasPreviousPage, hasNextPage, previousPage, nextPage } =
      getPagination(req.query, totalCards);
    const cards = await getFilteredCards(req.query, pageOffset, pageSize);
    return res.status(200).json({
      docs: cards,
      totalDocs: totalCards,
      page,
      pageSize,
      pageOffset,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      previousPage,
      nextPage,
    });
  } catch (error) {
    return res.status(400).json({ message: GET_CARDS_WITH_FILTERS_FAILURE_MESSAGE, errors: error.message });
  }
}

async function httpGetCard(req, res) {
  const { name } = req.params;
  if (name === undefined) {
    return res.status(400).json({ message: GET_CARD_FAILURE_MESSAGE, errors: EMPTY_NAME_PARAM_ERROR });
  }
  const card = await getCard(name);
  if (card.errors === undefined) {
    return res.status(200).json({ message: GET_CARD_SUCCESSFUL_MESSAGE, doc: card });
  } else {
    return res.status(400).json({ message: GET_CARD_FAILURE_MESSAGE, errors: card.errors });
  }
}

async function httpPatchCard(req, res) {
  try {
    const { name } = req.params;
    if (name === undefined) {
      return res.status(400).json({ message: UPDATED_FAILURE_MESSAGE, errors: EMPTY_NAME_PARAM_ERROR });
    }

    const fieldsToUpdate = req.body;
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: UPDATED_FAILURE_MESSAGE, errors: EMPTY_BODY_ERROR });
    }

    const patchResult = await patchCard(fieldsToUpdate, name);
    if (patchResult.errors === undefined) {
      return res.status(200).json({ message: patchResult.message, data: patchResult.data });
    } else {
      return res.status(400).json(patchResult);
    }
  } catch (error) {
    return res.status(400).json({ message: UPDATED_FAILURE_MESSAGE, errors: error.message });
  }
}

async function httpDeleteCard(req, res) {
  const { name } = req.params;
  if (name === undefined) {
    return res.status(400).json({ message: DELETED_FAILURE_MESSAGE, errors: EMPTY_NAME_PARAM_ERROR });
  }
  const deleteResult = await deleteCard(name);
  if (deleteResult.errors === undefined) {
    return res.status(200).json({ message: deleteResult.message, data: deleteResult.data });
  } else {
    return res.status(400).json(deleteResult);
  }
}

module.exports = { httpPostCards, httpGetCardsWithFilters, httpGetCard, httpPatchCard, httpDeleteCard };
