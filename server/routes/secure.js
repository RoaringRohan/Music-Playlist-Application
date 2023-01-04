const express = require('express');
const router = express.Router();
const verifyRole = require('../middleware/verifyRole')

router.get('/checking', verifyRole("Normal"), async (req, res) => {
    res.sendStatus(200);
})

module.exports = router;