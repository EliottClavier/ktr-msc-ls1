const io = require("socket.io")();
const socketAPI = {
  io: io,
  USERS: []
};

io.on("connection", function( socket ) {
  console.log( "A user connected" );

  socket.on("addUser", (user) => {
    if (!socketAPI.USERS.includes(user)) {
      let new_user = {};
      new_user[user] = socket.id
      socketAPI.USERS.push(new_user);
    }
    io.sockets.emit("sendUsers", socketAPI.USERS)
  });

  io.on('disconnect', () => {
    console.log( "A user disconnected" );
  });

});

module.exports = socketAPI;
