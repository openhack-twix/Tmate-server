const words = [
  "강아지",
  "망아지",
  "앵무새",
  "비둘기",
  "개미",
  "지렁이",
  "칠면조",
  "벌",
  "낙타"
];

module.exports = function generateRandomNickname() {
  return "익명의 " + words[Math.floor(Math.random() * words.length)] + Math.floor(Math.random() * 100);
};
