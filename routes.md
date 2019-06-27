uri: /api/rooms/
param: x
response: 존재하는 모든 방 배열

uri: /api/rooms/city
param: city ('California')
response: city에 존재하는 room들의 배열


uri: /auth/facebook
param: x

uri: /auth/facebook/callback
param: code (facebook에서 제공하는 값)
response: 
{
  id: string, // 1323785274449315
  displayName: string, // 김정우
  provider: string // facebook
}


on: "create room"
param:
  city, title, content, lat, lon, userid
emit: "create success", roomid

on: "join"
param:
  roomid, userid
emit: "join success", logs

on: "say"
param:
  roomid, message, userid
broadcast: "receive message", {user, message}