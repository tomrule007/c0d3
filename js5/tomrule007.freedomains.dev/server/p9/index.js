const { v4: uuidv4 } = require('uuid');
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const fs = require('fs');
const md5 = require('md5');
const { version } = require('os');
const MEME_INDEX_PATH = './data/p9/memeIndex';
const USER_MEME_PATH = './public/p9/meme/';
const USER_MEME_URL = '/p9/meme/';

// Create directory if it doesn't exist
fs.mkdirSync(USER_MEME_PATH, { recursive: true });

// TODO: persist version index;
const memeVersionIndex = JSON.parse(fs.readFileSync(MEME_INDEX_PATH));
console.log(memeVersionIndex);

const users = (() => {
  const userByUsername = {};
  const userById = {};
  //getById: id -> {id, username} | null
  const getById = (id) => userById[id];
  // getByUsername: name -> {id, username} | null
  const getByUsername = (username) => userByUsername[username];
  // createUser: username -> {id, username} | throw Error
  const createUser = (username) => {
    if (getByUsername(username)) throw Error('Username is already registered');
    const id = uuidv4();
    const user = { id, username };
    userByUsername[username] = user;
    userById[id] = user;

    return user;
  };
  return {
    getById,
    getByUsername,
    createUser,
  };
})();

router.use(cookieParser());

const protectedRoute = (req, res, next) => {
  const { loginCookie } = req.cookies;
  console.log({ loginCookie });
  if (!loginCookie)
    res.status(400).json({
      error: { message: 'Must send login cookie (loginCookie)' },
    });
  const user = users.getById(loginCookie);
  if (!user)
    res.status(400).json({
      error: { message: 'Invalid loginCookie' },
    });

  console.log({ user });
  req.user = user;

  next();
};

router.post('/api/user', (req, res) => {
  const { username } = req.body;
  if (!username)
    return res.status(400).json({
      error: { message: 'Must provide alphanumeric username' },
    });

  if (users.getByUsername(username))
    res.status(400).json({
      error: { message: 'Username is already registered' },
    });

  const user = users.createUser(username);

  res.cookie('loginCookie', user.id, { maxAge: 1000 * 60 * 60 * 24 * 3 }); // 3 days
  res.status(201).json({ username });
});

router.get('/api/user', protectedRoute, (req, res) => {
  res.cookie('loginCookie', req.user.id, { maxAge: 1000 * 60 * 60 * 24 * 3 }); // 3 days
  res.status(200).json({ username: req.user.username });
});

router.post('/api/meme', protectedRoute, async (req, res) => {
  console.log('POST');
  const { selfie, meme } = req.body;
  if (!selfie)
    return res
      .status(400)
      .json({ error: { message: "Missing 'selfie' field" } });

  const { username } = req.user;

  const memeFileName = username + '.png';
  const version = md5(selfie + meme);

  // skip update if meme is the same
  if (!memeVersionIndex[username] || memeVersionIndex[username] !== version) {
    // save new meme
    await fs.promises
      .writeFile(
        USER_MEME_PATH + memeFileName,
        selfie.split(',').pop(), //Insures the user didn't include meta data
        'base64'
      )
      .catch((e) => {
        console.log('WRITE_MEME_ERROR', e);
      });

    // update version index
    memeVersionIndex[username] = version;

    // persist updated version (only loaded on server crash/reboot, no need to wait)
    fs.promises
      .writeFile(MEME_INDEX_PATH, JSON.stringify(memeVersionIndex))
      .catch((e) => console.log('MEME_INDEX_PERSIST_ERROR', e));
  }

  return res
    .status(200)
    .json({ link: '/p8/selfie/' + username + '?' + version });
});

router.get('/api/meme', async (req, res) => {
  console.log('GET HERER');
  const memeFilePaths = Object.entries(memeVersionIndex).map(
    ([username, version]) => ({
      url: USER_MEME_URL + username + '.png?' + version,
      username,
    })
  );
  res.status(200).json({ memes: memeFilePaths });
});

module.exports = router;

if (process.env.NODE_ENV === 'test') {
  const MOCK_USER = users.createUser('mockyMockerson');
  module.exports.MOCK_USER = MOCK_USER;
}
