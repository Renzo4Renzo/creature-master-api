const express = require("express");
const { httpPostCards } = require("./cards.controller");

const cardsRouter = express.Router();

// cardsRouter.get("/", httpGetCardsWithFilter);
cardsRouter.post("/", httpPostCards);

module.exports = cardsRouter;
