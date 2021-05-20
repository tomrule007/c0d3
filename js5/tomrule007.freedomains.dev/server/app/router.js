const router = require('express').Router();

// Put all your server routes in here
router.use(require('./js5/p1'));
router.use(require('./js5/p2'));
router.use(require('./js5/p3'));

module.exports = router;
