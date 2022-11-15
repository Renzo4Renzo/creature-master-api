const express = require("express");
const {
  httpPostCards,
  httpGetCardsWithFilters,
  httpGetCard,
  httpPatchCard,
  httpDeleteCard,
} = require("./cards.controller");

const cardsRouter = express.Router();

cardsRouter.post("/", httpPostCards);
cardsRouter.get("/", httpGetCardsWithFilters);
cardsRouter.get("/:name", httpGetCard);
cardsRouter.patch("/:name", httpPatchCard);
cardsRouter.delete("/:name", httpDeleteCard);

module.exports = cardsRouter;
