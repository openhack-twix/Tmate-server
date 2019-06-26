const socketio = require("socket.io"); //1

const area = {
  name: "california",
  members: [],
  article: null
};

module.exports = exports = http => {
  const io = socketio(http);
  io.on("connection", function(socket) {

    // 본인이 속한 room에 join
    // 지역이 california라고 가정
    socket.join(area.name, err => {
      if (err) return console.error(`Failed to enter the room:${area.name}`);

      area.members.push(socket);
      console.log(`Joined the room: ${area.name}`);
      socket.emit("joined", `${area.name}에 입장`);

      if(area.article){
        socket.emit('notice', area.article);
      }
    });
    console.log(`user connected to ${area.name}: `, socket.id); //3-1

    socket.on("leave", () => {
      // TODO: 지역에서 탈출
    });

    // 연결을 종료했을 때
    socket.on("disconnect", function() {
      // TODO: 연결 종료
      console.log("user disconnected: ", socket.id);
    });

    // 새로운 글을 등록했을 때
    socket.on("post message", function(name, text) {
      // TODO: 해당 지역에 새 글 등록
    });
  });
};
