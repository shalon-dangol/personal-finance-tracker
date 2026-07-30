const express = require('express');
const router = express.Router();
const { placeholder } = require('../controllers/placeholderController');

router.get('/', placeholder);

module.exports = router;
