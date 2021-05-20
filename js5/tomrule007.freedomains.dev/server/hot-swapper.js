// Hot Module reloading.
// taken from: https://nimblewebdeveloper.com/blog/hot-reload-nodejs-server
let swapCount = 0;
const hotSwapper = (cb) => () => {
  if (process.env.NODE_ENV === 'development') {
    const chokidar = require('chokidar');
    const watcher = chokidar.watch('./server/app');

    watcher.on('ready', function () {
      watcher.on('all', function () {
        let updates = [];
        console.log('Checking Hot...');
        //   console.log(require.cache);
        Object.keys(require.cache).forEach(function (id) {
          //Get the local path to the module
          const localId = id.substr(process.cwd().length);
          //Ignore anything not in server/app
          if (!localId.match(/^\/server\/app\//)) return;
          //Remove the module from the cache
          updates.push(`SWAPPING: ${localId}`);
          //   console.log(`SWAPPING: ${localId}`);
          setTimeout(() => {
            delete require.cache[id];
          }, 200);
        });
        swapCount++;
        updates.push(`All Hots are swapped! ${swapCount}`);
        cb(updates);
        // console.log('All Hots are swapped!', swapCount);
      });
    });
  }
};

const cors = require('cors');
var app = require('express')();
app.use(cors());
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${process.env.PORT}`,
    methods: ['GET', 'POST'],
  },
});
let sockets = [];
io.on('connection', function (socket) {
  sockets.push(socket);
  console.log('user connected');
  socket.emit('page', 'welcome man');
});
io.on('New Page', (id) => {
  console.log('New Page Id', id);
});

http.listen(3000, function () {
  console.log('hot swapper on port 3000');
});

const notifyConnections = (updates) => {
  updates.forEach((update) => console.log(update));
  sockets.forEach((socket) => {
    socket.emit('reload', 'Please Reload');
    console.log('Reloaded socket');
  });
};

module.exports = { hotSwapper: hotSwapper(notifyConnections), swapCount };
