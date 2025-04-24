const { askChat } = require("../controllers/chat.controller");

const router = require("express").Router();

router.post("/", askChat);

module.exports = router;
