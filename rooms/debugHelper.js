module.exports = function getFakeUser(socketId){
  return {
    _id: socketId,
    name: 'user'+socketId
  };
};