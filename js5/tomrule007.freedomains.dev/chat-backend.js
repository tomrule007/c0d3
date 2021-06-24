const http = require('http');
const socketIo = require('socket.io');

// TODO: real app would require this information to be stored in a database
const users = {
  1: {
    name: 'MockMan',
  },
};
const userNames = new Set('MockMan');

// Message store (real app should not store all messages in memory and should have some way to persist msg history)
const messages = [];





const socketIdToUserId = {};

const createNewUser = (id, name = 'noName', count = 0) => {
  const fullName = count ? name.concat(count) : name;

  if (!userNames.has(fullName)) {
    // create and return unique name.
    const user = { name: fullName };
    users[id] = user;
    userNames.add(fullName);

    return user;
  }

  // inc count and try again
  return createNewUser(id, name, count + 1);
};

const sendUserInfo = (id) => {};



// EVENT HANDLERS
const handleMessageReceived = (socket, io, msg) => {
    // receive message -> lookup sender name -> create timestamp 
    //  -> Add it to message list -> broadcast new message

    const userId = socketIdToUserId[socket.id];

    const user = users[userId];

    // TODO add error message or re request user ID
    if (!user) return;

    console.log({ user, userId, socketId: socket.id });
    const msgNameTime = { sender: user.name, time: Date.now(), msg };
    messages.push(msgNameTime);
    io.emit('newMsg', msgNameTime);
    console.log('newMsg: ', io.emit, msg, msgNameTime);
}

const handleMessageHistoryRequest = (socket,io) =>{
    socket.emit('messageHistory' ,messages);
}

const handleGetUserInfo =(socket,io,id) => {
    console.log('connected user id:', id);

    const user = users[id] || createNewUser(id);

    // link socketId to user id;
    socketIdToUserId[socket.id] = id;
    console.log('connected socket.id: ', socket.id);
    socket.emit('userInfo', user);
}



const handleClientDisconnect = (socket) => {
  console.log('Client disconnected');
  delete socketIdToUserId[socket.id];
  console.log('deleted: ', socket.id);
};




const handleClientConnect = (socket, io) => {
    // TODO: maybe these could be registered on io server instead of socket (as they are global)
    // client connects -> registers event listeners 
  socket.on('getUserInfo', (id) => handleGetUserInfo(socket,io,id));
  socket.on('getMessageHistory', ()=> handleMessageHistoryRequest(socket,io))
  socket.on('newMsg', (msg) => handleMessageReceived(socket,io,msg));
  socket.on('disconnect', () => handleClientDisconnect(socket));
};

// const handleNameChange

// startSocketIoServer :: App -> http.Server
const startSocketIoServer = (app) => {
  const server = http.createServer(app);
  const io = socketIo(server);
  io.on('connection', (socket) => handleClientConnect(socket, io));
  return server;
};

module.exports = startSocketIoServer;
