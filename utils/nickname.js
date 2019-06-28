const words = [
  "병아리",
  "돌고래",
  "앵무새",
  "비둘기",
  "개미",
  "지렁이",
  "칠면조",
  "기린",
  "낙타"
];

module.exports = function generateRandomNickname() {
  return "익명의 " + words[Math.floor(Math.random() * words.length)] + Math.floor(Math.random() * 100);
};
