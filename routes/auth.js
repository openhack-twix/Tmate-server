const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const logger = require("../logger");

const generateColor = require("../utils/color");
const generateRandomNickname = require("../utils/nickname");

router.post("/login", async (req, res) => {
  const username = req.body.username;
  logger.debug(`[${username}]으로 로그인 시도`);
  let user = await User.findOne({ username });
  if (!user) {
    const colorcode = generateColor();
    const nickname = generateRandomNickname();
    user = await new User({ username, colorcode, nickname }).save();
    logger.info(user);
  }

  logger.info(`${user.nickname} 로그인`);
  return res.status(200).send({
    success: "0",
    colorcode: user.colorcode,
    user: user._id,
    nickname: user.nickname
  });
});

router.post("/logout", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.id);
    logger.info(`${user.nickname} 로그아웃`);
  } catch (err) {
    res.status(400).send("비정상 요청");
  }
});

module.exports = router;
