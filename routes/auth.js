const express = require('express');
const router = express.Router();
const {User} = require('../models/user');

const authService = require('../services/auth');
const generateColor = require('../utils/color');

const words = ["강아지", "망아지", "앵무새", "비둘기", "개미", "지렁이", "칠면조", "벌"];
function generateWord(){
  return '익명의 '+words[Math.floor(Math.random()%3)];
}

router.post('/login', async (req,res)=>{
  const username = req.body.username;
  let user = await User.findOne({username});
  if(!user){
    const colorcode = generateColor();
    const nickname = generateWord();
    user = await (new User({username, colorcode, nickname})).save();
    console.log(user);
  } 

  console.log('login success');
  return res.status(200).send({
    success: "0",
    colorcode: user.colorcode,
    user: user._id,
    nickname: user.nickname
  });
});

router.post('/logout', async (req,res)=>{
  try{
  await User.findByIdAndDelete(req.body.id);
  } catch(err){
    res.status(400).send('비정상 요청');
  }
})

module.exports = router;