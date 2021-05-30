const { v4: uuidv4 } = require('uuid');
const router = require('express').Router();
const cookieParser = require('cookie-parser');

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

router.get('/api/user', (req, res) => {
  const { loginCookie } = req.cookies;
  if (!loginCookie)
    res.status(400).json({
      error: { message: 'Must send login cookie (loginCookie)' },
    });
  const user = users.getById(loginCookie);
  if (!user)
    res.status(400).json({
      error: { message: 'Invalid loginCookie' },
    });

  res.cookie('loginCookie', user.id, { maxAge: 1000 * 60 * 60 * 24 * 3 }); // 3 days
  res.status(200).json({ username: user.username });
});

module.exports = router;

if (process.env.NODE_ENV === 'test') {
  const MOCK_USER = users.createUser('mockyMockerson');
  module.exports.MOCK_USER = MOCK_USER;
}
