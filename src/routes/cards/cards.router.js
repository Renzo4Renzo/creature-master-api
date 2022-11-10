const express = require("express");
const { httpPostCards, httpGetCardsWithFilters, httpGetCard, httpPatchCard } = require("./cards.controller");

const cardsRouter = express.Router();

cardsRouter.post("/", httpPostCards);
cardsRouter.get("/", httpGetCardsWithFilters);
cardsRouter.get("/:name", httpGetCard);
cardsRouter.patch("/:name", httpPatchCard);

module.exports = cardsRouter;
