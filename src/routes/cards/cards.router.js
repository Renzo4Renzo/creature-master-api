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
cardsRouter.get("/:id", httpGetCard);
cardsRouter.patch("/:id", httpPatchCard);
cardsRouter.delete("/:id", httpDeleteCard);

module.exports = cardsRouter;
