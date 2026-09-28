const express = require('express');
const router = express.Router();
const { registerIntern } = require('../controllers/internController');

router.post('/register', registerIntern);

module.exports = router;
