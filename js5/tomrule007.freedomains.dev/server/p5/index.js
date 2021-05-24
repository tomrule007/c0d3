const router = require('express').Router();
const fs = require('fs').promises;

const { LRUCache } = require('../utilities');

const ROOMS_DIR = './server/p5/rooms';

const getRoomFromDisk = (room) => fs.readFile(ROOMS_DIR + room);

const roomCache = new LRUCache(5);

const roomDataStore = {
  get: (room) => {
    if (roomCache.has(room)) return roomCache.get(room);
  },
};

// router.get('/chatroom', (req, res) => {
//   res.sendFile('public/chatroom.html');
// });

router.get('/api/sessions', async (req, res) => {
  res.status(500);
  res.json({ error: 'end point not built' });
});

router.post('/api/:room/messages', async (req, res) => {
  const { room } = req.params;
  const { msg } = req.body;

  res.json({ room, msg });
});

router.get('/api/:room/messages', async (req, res) => {
  const { room } = req.params;
  const { msg } = req.body;
  console.log({ room, msg });
  // validate room

  res.json({ room });
});

module.exports = router;
