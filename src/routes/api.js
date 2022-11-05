const express = require("express");

const cardsRouter = require("./cards/cards.router");
// const decksRouter = require("./decks/decks.router");

const api = express.Router();

api.use("/cards", cardsRouter);

module.exports = api;
