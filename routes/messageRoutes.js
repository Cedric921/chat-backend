const router = require('express').Router()

const {
    addMessage,
    getAllMessage,
} = require('../controllers/messagesController');

router.post('/addmsg', addMessage);
router.post('/getmsg', getAllMessage);


module.exports = router;