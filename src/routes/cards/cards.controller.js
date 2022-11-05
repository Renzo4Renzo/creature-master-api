const { postCard } = require("../../models/cards.model");

async function httpPostCards(req, res) {
  const card = req.body;

  if (Object.keys(card).length === 0) {
    return res.status(400).json({ error: "No data was received!" });
  }

  const postResult = await postCard(card);
  if (postResult.errors === undefined) {
    return res.status(201).json({ message: postResult.message, data: postResult.data });
  } else {
    return res.status(400).json(postResult);
  }
}

module.exports = { httpPostCards };
