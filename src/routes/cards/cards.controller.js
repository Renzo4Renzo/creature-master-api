const { postCard, getFilteredCards, countCards, getCard } = require("../../models/cards.model");
const { getPagination } = require("../../services/pagination");
const { sortDocuments } = require("../../services/sort");

const SAVED_FAILURE_MESSAGE = "Could not save the card!";
const GET_CARDS_WITH_FILTERS_FAILURE_MESSAGE = "Could not retrieve cards!";
const GET_CARD_SUCCESSFUL_MESSAGE = "Card found!";
const GET_CARD_FAILURE_MESSAGE = "Could not retrieve card!";

async function httpPostCards(req, res) {
  const card = req.body;

  if (Object.keys(card).length === 0) {
    return res.status(400).json({ message: SAVED_FAILURE_MESSAGE, error: "No data was received!" });
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
    return res.status(400).json({ message: GET_CARDS_WITH_FILTERS_FAILURE_MESSAGE, error: error.message });
  }
}

async function httpGetCard(req, res) {
  try {
    const { name } = req.params;
    if (name === undefined) {
      return res.status(400).json({ message: GET_CARD_FAILURE_MESSAGE, error: "name was not specified in the path!" });
    }
    const card = await getCard(name);
    return res.status(200).json({ message: GET_CARD_SUCCESSFUL_MESSAGE, doc: card });
  } catch (error) {
    return res.status(400).json({ message: GET_CARD_FAILURE_MESSAGE, error: error.message });
  }
}

module.exports = { httpPostCards, httpGetCardsWithFilters, httpGetCard };
