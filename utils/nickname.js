const words = [
  "강아지",
  "망아지",
  "앵무새",
  "비둘기",
  "개미",
  "지렁이",
  "칠면조",
  "벌"
];

module.exports = function generateRandomNickname() {
  return "익명의 " + words[Math.floor(Math.random() % words.length)];
};
