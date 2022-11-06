const express = require("express");
const { httpPostCards, httpGetCardsWithFilters, httpGetCard } = require("./cards.controller");

const cardsRouter = express.Router();

cardsRouter.post("/", httpPostCards);
cardsRouter.get("/", httpGetCardsWithFilters);
cardsRouter.get("/:name", httpGetCard);

module.exports = cardsRouter;
