const express = require('express');
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', requireAuth, userController.user_index);
router.get('/users/:id', requireAuth, userController.user_details);
router.delete('/users/:id', requireAuth, userController.user_delete);


module.exports = router; 