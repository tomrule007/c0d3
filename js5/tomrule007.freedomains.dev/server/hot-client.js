const { v4: uuidv4 } = require('uuid');

module.exports =
  () => ` <script src="http://localhost:3000/socket.io/socket.io.js"></script>
  <script>
    var socket = io('http://localhost:3000');
    // use your socket
    socket.on('connection', () => {
      window.HotId = {id:'${uuidv4()}',url: window.location.href};
      console.log(HotId);
      socket.emit('New Page', HotId)
    });
    socket.on('welcome', (message) => {
      console.log(message);
    });
    socket.on('reload', (message) => {
      console.log('RELOADING server says:', message);
        location.reload();
    });
  </script>`;
