var express = require('express');
var router = express.Router();

router.post('/', async (req, res, next) => {
  res.clearCookie("connection");
  res.redirect('/login');
})

module.exports = router;
