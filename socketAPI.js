const io = require("socket.io")();
const socketAPI = {
  io: io,
  USERS: []
};

io.on("connection", function( socket ) {
  socket.on("addUser", (user) => {
    let foundUser = socketAPI.USERS.findIndex(u => u.username === user);
    console.log(foundUser)
    if (foundUser < 0) {
      socketAPI.USERS.push({username: user, socketID: socket.id});
    } else {
      socketAPI.USERS[foundUser]["socketID"] = socket.id;
    }
    io.sockets.emit("sendUsers", socketAPI.USERS)
  });

  socket.on("removeUser", (user) => {
    socketAPI.USERS = socketAPI.USERS.filter(u => u.username !== user);
    io.sockets.emit("sendUsers", socketAPI.USERS)
  });

  socket.on("askExchange", (data) => {
    io.to(data[1]).emit("receiveAskExchange", data);
  })

  socket.on("answerTrueExchange", (data) => {
    data.forEach(s => io.to(s).emit("proceedExchange"))
  })

  socket.on("answerFalseExchange", (data) => {
    io.to(data[0]).emit("cancelExchange", data);
  })

  socket.on('disconnect', () => {
    console.log( "A user disconnected" );
  });

});

module.exports = socketAPI;
