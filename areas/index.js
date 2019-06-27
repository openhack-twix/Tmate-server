/**
 * {
 *  name: '',
 *  friends: [{
 *    [socketid]: userObject
 *    }],
 *  posts: []
 * }
 *
 *
 */

const areas = [
  { name: "Seoul", friends: {}, rooms: [] },
  { name: "Jeju", friends: {}, rooms: [] }
];

function addUser(areaName, socketId, user) {
  const index = areas.findIndex(area => area.name === areaName);
  const alreadyExists = areas[index].friends[socketId];

  if (alreadyExists) {
    console.log(`room:${areaName}에 사용자 ${user._id}가 이미 등록되어있음.`);
    return null;
  }

  areas[index].friends = {
    ...areas[index].friends,
    [socketId]: user
  };

  return areas[index];
}

function deleteUser(areaName, socketId) {
  const area = areas.find(area => area.name === areaName);
  if (!area) {
    console.log(`지역 ${area.name}가 존재하지 않음`);
    return null;
  }

  area.friends = delete area.friends[socketId]

  return area;
}

function deleteUserBySocketId(socketId){
  const area = areas.find((area)=>area.friends[socketId]);
  if(!area) return null;
  delete area.friends[socketId];
  return area;
}

function createRoom(areaName, post) {
  const area = areas.find(area => area.name === areaName);
  if (!area) {
    console.log(`지역 ${area.name}가 존재하지 않음`);
    return null;
  }

  // TODO: DB 등록
  area.rooms.push(post);

  return area;
}

function join(user, areaName, roomId){
  const index = areas.findIndex(area=>area.name===areaName);
  
}

function say(user, post){

}

module.exports = {
  addUser,
  deleteUser,
  deleteUserBySocketId,
  createRoom,
   say
};
